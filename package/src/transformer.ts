import fs from "fs";
import path from "path";
import { annotateFile } from "./annotate";
import { extractDecl, type TypeDecl } from "./type-extractor";
import { emitTypesFile } from "./luau-emitter";
import type ts from "typescript";

// ── Config ────────────────────────────────────────────────────────────────

interface PluginConfig {
    verbose?: boolean;
    typesOutput?: string;
}

// prefix for user-defined type module access in annotated Luau files
const TYPE_MODULE = "__luauAnnotateTypes";

// ── Scalar / Roblox type map ──────────────────────────────────────────────

const SCALAR_TYPE_MAP: Record<string, string> = {
    number: "number",
    string: "string",
    boolean: "boolean",
    buffer: "buffer",
    Vector3: "Vector3",
    Vector2: "Vector2",
    Vector3int16: "Vector3int16",
    Vector2int16: "Vector2int16",
    CFrame: "CFrame",
    Color3: "Color3",
    UDim: "UDim",
    UDim2: "UDim2",
    Rect: "Rect",
    Region3: "Region3",
    NumberRange: "NumberRange",
    Ray: "Ray",
    BrickColor: "BrickColor",
    TweenInfo: "TweenInfo",
    Instance: "Instance",
    BasePart: "BasePart",
    Part: "Part",
    Model: "Model",
    Player: "Player",
    Humanoid: "Humanoid",
    Animation: "Animation",
    RemoteEvent: "RemoteEvent",
    Folder: "Folder",
    Tool: "Tool",
    Workspace: "Workspace",
    Camera: "Camera",
    RunService: "RunService",
    Players: "Players",
    Teams: "Teams",
    ReplicatedStorage: "ReplicatedStorage",
    TweenService: "TweenService",
    UserInputService: "UserInputService",
    CollectionService: "CollectionService",
    HttpService: "HttpService",
    SoundService: "SoundService",
    Script: "Script",
    LocalScript: "LocalScript",
    ModuleScript: "ModuleScript",
    SelectionBox: "SelectionBox",
    ParticleEmitter: "ParticleEmitter",
    Sound: "Sound",
    Attachment: "Attachment",
    Weld: "Weld",
};

// ── Roblox services (for Rojo project parsing) ────────────────────────────

const ROBLOX_SERVICES = new Set([
    "ReplicatedStorage",
    "ServerScriptService",
    "ServerStorage",
    "Workspace",
    "StarterGui",
    "StarterPack",
    "StarterPlayer",
    "SoundService",
    "Lighting",
    "HttpService",
    "Teams",
    "TextChatService",
    "Chat",
    "LocalizationService",
]);

// ── Types ─────────────────────────────────────────────────────────────────

export type SidecarEntry = {
    params: string[];
    returns: string;
    locals: Record<string, string>;
};

export type SidecarMeta = {
    requirePath: string;
};

export type SidecarData = {
    __meta__?: SidecarMeta;
    [key: string]: SidecarEntry | SidecarMeta | undefined;
};

type Pending = { luauPath: string; sidecarPath: string };
type RojoPathEntry = { service: string; segments: string[]; fsPath: string };

// ── Module state ──────────────────────────────────────────────────────────

const pendingFiles: Pending[] = [];
const globalTypeRegistry = new Map<string, TypeDecl>();
const usedTypeNames = new Set<string>();
let hooked = false;
let verbose = true;
let typesOutputPath = "shared/__generated__";
let projectOutDir = "";

const isWatchMode = process.argv.some((a) => a === "-w" || a === "--watch");

// ── Helpers ───────────────────────────────────────────────────────────────

function displayPath(p: string): string {
    return p.split(path.sep).slice(-2).join("/");
}

function log(msg: string) {
    if (verbose) console.error(msg);
}

function getTypesFilePath(): string {
    return path.join(projectOutDir, typesOutputPath, "generated.types.luau");
}

function computeLuauPath(sourceFileName: string, rootDir: string, outDir: string): string {
    const rel = path.relative(rootDir, sourceFileName);
    return path.join(outDir, rel.replace(/\.ts$/, ".luau").replace(/\bindex\.luau$/, "init.luau"));
}

function computeSidecarPath(luauPath: string, outDir: string): string {
    return path.join(
        outDir,
        "types",
        path.relative(outDir, luauPath).replace(/\.luau$/, ".types.json"),
    );
}

// ── Rojo project parsing ──────────────────────────────────────────────────

function findRojoProject(startDir: string): string | null {
    let dir = startDir;
    for (let i = 0; i < 6; i++) {
        const def = path.join(dir, "default.project.json");
        if (fs.existsSync(def)) return def;
        const found = fs.readdirSync(dir).find((f) => f.endsWith(".project.json"));
        if (found) return path.join(dir, found);
        const parent = path.dirname(dir);
        if (parent === dir) break;
        dir = parent;
    }
    return null;
}

function parseRojoPathMap(projectFile: string): RojoPathEntry[] {
    const projectDir = path.dirname(projectFile);
    const project = JSON.parse(fs.readFileSync(projectFile, "utf8")) as Record<string, unknown>;
    const entries: RojoPathEntry[] = [];

    function walk(node: Record<string, unknown>, segments: string[], service: string | null) {
        // if this node has a $path and we're inside a service, record it
        if (typeof node["$path"] === "string" && service) {
            entries.push({
                service,
                segments: [...segments],
                fsPath: path.resolve(projectDir, node["$path"] as string),
            });
        }
        for (const [key, value] of Object.entries(node)) {
            if (key.startsWith("$") || typeof value !== "object" || !value) continue;
            if (!service && ROBLOX_SERVICES.has(key)) {
                // entering a top-level service node
                walk(value as Record<string, unknown>, [], key);
            } else if (service) {
                // already inside a service — key becomes a path segment
                walk(value as Record<string, unknown>, [...segments, key], service);
            }
        }
    }

    walk((project.tree ?? {}) as Record<string, unknown>, [], null);
    return entries;
}

// converts a types file path to a TS.import() call using Rojo mappings
function computeRequirePath(typesLuau: string, rojoEntries: RojoPathEntry[]): string {
    for (const entry of rojoEntries) {
        if (!typesLuau.startsWith(entry.fsPath + path.sep)) continue;

        const rel = path.relative(entry.fsPath, typesLuau);
        const relSegments = rel
            .split(path.sep)
            .map((p, i, arr) => (i === arr.length - 1 ? p.replace(/\.luau$/, "") : p));

        const all = [...entry.segments, ...relSegments].map((s) => `"${s}"`).join(", ");
        return `TS.import(script, game:GetService("${entry.service}"), ${all})`;
    }
    // fallback if no Rojo mapping found
    return `require(script.Parent["generated.types"])`;
}

// ── File emission ─────────────────────────────────────────────────────────

function writeTypesFile() {
    if (usedTypeNames.size === 0) return;
    const fp = getTypesFilePath();
    fs.mkdirSync(path.dirname(fp), { recursive: true });
    fs.writeFileSync(fp, emitTypesFile(globalTypeRegistry, usedTypeNames));
    log(`[luau-annotate] generated ${displayPath(fp)} (${usedTypeNames.size} types)`);
}

function hookExit() {
    if (hooked) return;
    hooked = true;
    process.on("exit", () => {
        writeTypesFile();
        let count = 0;
        for (const { luauPath, sidecarPath } of pendingFiles) {
            if (!fs.existsSync(luauPath) || !fs.existsSync(sidecarPath)) continue;
            try {
                const sidecar = JSON.parse(fs.readFileSync(sidecarPath, "utf8")) as SidecarData;
                annotateFile(luauPath, sidecar);
                fs.unlinkSync(sidecarPath);
                count++;
            } catch (e) {
                log(`[luau-annotate] failed on ${displayPath(luauPath)}: ${e}`);
            }
        }
        pendingFiles.length = 0;
        if (count > 0) log(`[luau-annotate] annotated ${count} files`);
    });
}

// ── Watch mode ────────────────────────────────────────────────────────────

function watchAndAnnotate(luauPath: string, sidecarPath: string) {
    const dir = path.dirname(luauPath);
    const filename = path.basename(luauPath);
    let done = false;

    const tryNow = () => {
        if (!fs.existsSync(sidecarPath)) return false;
        writeTypesFile();
        try {
            const sidecar = JSON.parse(fs.readFileSync(sidecarPath, "utf8")) as SidecarData;
            annotateFile(luauPath, sidecar);
            fs.unlinkSync(sidecarPath);
            log(`[luau-annotate] annotated ${displayPath(luauPath)}`);
        } catch (e) {
            log(`[luau-annotate] failed on ${displayPath(luauPath)}: ${e}`);
        }
        return true;
    };

    if (fs.existsSync(luauPath)) {
        setTimeout(tryNow, 50);
        return;
    }
    fs.mkdirSync(dir, { recursive: true });

    const watcher = fs.watch(dir, (_, changedFile) => {
        if (done || changedFile !== filename) return;
        if (!fs.existsSync(sidecarPath)) {
            watcher.close();
            return;
        }
        done = true;
        watcher.close();
        setTimeout(tryNow, 50);
    });
    setTimeout(() => {
        if (!done) watcher.close();
    }, 10000);
}

// ── Transformer ───────────────────────────────────────────────────────────

export default function transformer(
    program: ts.Program,
    config: PluginConfig | undefined,
    { ts: t }: { ts: typeof ts },
): ts.TransformerFactory<ts.SourceFile> {
    verbose = config?.verbose !== false;
    if (config?.typesOutput) typesOutputPath = config.typesOutput;

    const checker = program.getTypeChecker();
    const opts = program.getCompilerOptions();
    const rootDir = opts.rootDir ? path.resolve(opts.rootDir) : path.resolve("src");
    const outDir = opts.outDir ? path.resolve(opts.outDir) : path.resolve("out");
    projectOutDir = outDir;
    hookExit();

    // parse Rojo project file automatically
    const rojoFile = findRojoProject(rootDir);
    const rojoEntries = rojoFile ? parseRojoPathMap(rojoFile) : [];
    if (rojoFile)
        log(`[luau-annotate] rojo: ${path.basename(rojoFile)} (${rojoEntries.length} paths)`);

    // ── Type resolution ───────────────────────────────────────────────────

    // strips file-path parents, handles namespace prefixing
    function qualName(sym: ts.Symbol): string {
        const name = sym.getName();
        const parent = (sym as unknown as { parent?: ts.Symbol }).parent;
        if (!parent) return name;
        const parentName = parent.getName();
        if (parentName.includes("/") || parentName.includes("\\") || parentName.includes("."))
            return name;
        if (parentName === "__global" || parentName === "unknown") return name;
        return `${parentName}_${name}`;
    }

    // AST-based type resolution — preserves named types
    function mapTypeNode(typeNode: ts.TypeNode): string | null {
        // keyword primitives
        if (typeNode.kind === t.SyntaxKind.StringKeyword) return "string";
        if (typeNode.kind === t.SyntaxKind.NumberKeyword) return "number";
        if (typeNode.kind === t.SyntaxKind.BooleanKeyword) return "boolean";
        if (typeNode.kind === t.SyntaxKind.VoidKeyword) return "()";
        if (
            typeNode.kind === t.SyntaxKind.AnyKeyword ||
            typeNode.kind === t.SyntaxKind.UnknownKeyword
        )
            return "any";
        if (typeNode.kind === t.SyntaxKind.NeverKeyword) return "never";
        if (
            typeNode.kind === t.SyntaxKind.UndefinedKeyword ||
            typeNode.kind === t.SyntaxKind.NullKeyword
        )
            return "any";

        // named type references
        if (t.isTypeReferenceNode(typeNode)) {
            const ref = typeNode as ts.TypeReferenceNode;
            const sym = checker.getSymbolAtLocation(ref.typeName);
            if (sym) {
                const resolved =
                    sym.flags & t.SymbolFlags.Alias ? checker.getAliasedSymbol(sym) : sym;
                const declName = resolved.getName();

                // scalar / roblox types
                if (SCALAR_TYPE_MAP[declName]) return SCALAR_TYPE_MAP[declName];

                // built-in generic collections
                if (declName === "Array" || declName === "ReadonlyArray") {
                    const inner = ref.typeArguments?.[0]
                        ? mapTypeNode(ref.typeArguments[0])
                        : "any";
                    return `{${inner ?? "any"}}`;
                }
                if (declName === "Map" || declName === "ReadonlyMap") {
                    const k = ref.typeArguments?.[0]
                        ? (mapTypeNode(ref.typeArguments[0]) ?? "any")
                        : "any";
                    const v = ref.typeArguments?.[1]
                        ? (mapTypeNode(ref.typeArguments[1]) ?? "any")
                        : "any";
                    return `{[${k}]: ${v}}`;
                }
                if (declName === "Set" || declName === "ReadonlySet") {
                    const k = ref.typeArguments?.[0]
                        ? (mapTypeNode(ref.typeArguments[0]) ?? "any")
                        : "any";
                    return `{[${k}]: boolean}`;
                }
                if (declName === "Record") {
                    const k = ref.typeArguments?.[0]
                        ? (mapTypeNode(ref.typeArguments[0]) ?? "any")
                        : "any";
                    const v = ref.typeArguments?.[1]
                        ? (mapTypeNode(ref.typeArguments[1]) ?? "any")
                        : "any";
                    return `{[${k}]: ${v}}`;
                }
                if (declName === "LuaTuple") {
                    const inner = ref.typeArguments?.[0];
                    if (inner && t.isTupleTypeNode(inner)) {
                        const elements = (inner as ts.TupleTypeNode).elements.map((e) => {
                            const en = (
                                t.isNamedTupleMember?.(e)
                                    ? (e as unknown as { type: ts.TypeNode }).type
                                    : e
                            ) as ts.TypeNode;
                            return mapTypeNode(en) ?? "any";
                        });
                        return `(${elements.join(", ")})`;
                    }
                    return inner ? (mapTypeNode(inner) ?? "any") : "any";
                }

                // user-defined types — extract and prefix with TYPE_MODULE
                const decls = resolved.declarations;
                if (decls?.length) {
                    const decl = decls[0];
                    if (t.isInterfaceDeclaration(decl) || t.isTypeAliasDeclaration(decl)) {
                        const qn = qualName(resolved);
                        extractDecl(
                            decl as ts.InterfaceDeclaration | ts.TypeAliasDeclaration,
                            checker,
                            t,
                            globalTypeRegistry,
                            qn,
                        );
                        usedTypeNames.add(qn);
                        if (ref.typeArguments?.length) {
                            const args = ref.typeArguments
                                .map((a) => mapTypeNode(a) ?? "any")
                                .join(", ");
                            return `${TYPE_MODULE}.${qn}<${args}>`;
                        }
                        return `${TYPE_MODULE}.${qn}`;
                    }
                }
            }
        }

        // T[]
        if (t.isArrayTypeNode(typeNode)) {
            const inner = mapTypeNode((typeNode as ts.ArrayTypeNode).elementType) ?? "any";
            return `{${inner}}`;
        }

        // A | B | undefined → optional
        if (t.isUnionTypeNode(typeNode)) {
            const types = (typeNode as ts.UnionTypeNode).types;
            const isNull = (n: ts.TypeNode) =>
                n.kind === t.SyntaxKind.UndefinedKeyword || n.kind === t.SyntaxKind.NullKeyword;
            const hasNull = types.some(isNull);
            const nonNull = types.filter((n) => !isNull(n));
            if (nonNull.length === 0) return "any";
            const inner = nonNull.length === 1 ? mapTypeNode(nonNull[0]) : null;
            if (inner && hasNull) return `${inner}?`;
            if (inner) return inner;
        }

        // fallback: inferred/complex types via type checker
        return mapType(checker.getTypeFromTypeNode(typeNode));
    }

    // type-object-based resolution for inferred types (locals, return inference)
    function mapType(type: ts.Type): string | null {
        if (type.isUnion()) {
            const nonNull = type.types.filter(
                (t2) => !(t2.flags & t.TypeFlags.Undefined) && !(t2.flags & t.TypeFlags.Null),
            );
            if (nonNull.length === 1) {
                const inner = mapType(nonNull[0]);
                return inner ? `${inner}?` : null;
            }
            return null;
        }

        const name = checker.typeToString(type);
        if (SCALAR_TYPE_MAP[name]) return SCALAR_TYPE_MAP[name];
        if ((type as ts.LiteralType).isNumberLiteral?.()) return "number";
        if ((type as ts.LiteralType).isStringLiteral?.()) return "string";
        if (name === "true" || name === "false") return "boolean";

        if (checker.isArrayType(type)) {
            const args = (type as ts.TypeReference).typeArguments;
            const inner = args?.[0] ? mapType(args[0]) : null;
            return inner ? `{${inner}}` : "{any}";
        }

        const sym = type.getSymbol();
        if (sym?.getName() === "Map" || sym?.getName() === "ReadonlyMap") {
            const args = (type as ts.TypeReference).typeArguments;
            const k = args?.[0] ? (mapType(args[0]) ?? "any") : "any";
            const v = args?.[1] ? (mapType(args[1]) ?? "any") : "any";
            return `{[${k}]: ${v}}`;
        }
        if (sym?.getName() === "Set" || sym?.getName() === "ReadonlySet") {
            const args = (type as ts.TypeReference).typeArguments;
            const k = args?.[0] ? (mapType(args[0]) ?? "any") : "any";
            return `{[${k}]: boolean}`;
        }

        return null;
    }

    // central wrapper — applies optional/rest flags on top of mapTypeNode
    function resolveTypeAnnotation(
        typeNode: ts.TypeNode | undefined,
        flags?: { optional?: boolean; rest?: boolean },
    ): string {
        if (!typeNode) return "";
        let result = mapTypeNode(typeNode) ?? "";
        if (!result) return "";
        if (flags?.rest && !result.startsWith("{")) result = `{${result}}`;
        if (flags?.optional && !result.endsWith("?")) result = `${result}?`;
        return result;
    }

    // ── Sidecar extraction ────────────────────────────────────────────────

    function extractParams(node: ts.FunctionDeclaration | ts.MethodDeclaration): string[] {
        return node.parameters.map((p) =>
            resolveTypeAnnotation(p.type, {
                optional: p.questionToken !== undefined,
                rest: p.dotDotDotToken !== undefined,
            }),
        );
    }

    function extractReturn(node: ts.FunctionDeclaration | ts.MethodDeclaration): string {
        if (node.type) {
            const result = resolveTypeAnnotation(node.type);
            return result === "()" ? "" : result; // suppress void return annotation
        }
        const sig = checker.getSignatureFromDeclaration(node);
        if (sig) return mapType(checker.getReturnTypeOfSignature(sig)) ?? "";
        return "";
    }

    function extractLocals(body: ts.Block): Record<string, string> {
        const locals: Record<string, string> = {};
        function walk(node: ts.Node) {
            if (
                t.isFunctionDeclaration(node) ||
                t.isFunctionExpression(node) ||
                t.isArrowFunction(node) ||
                t.isMethodDeclaration(node)
            )
                return;
            if (t.isVariableStatement(node)) {
                for (const decl of node.declarationList.declarations) {
                    if (t.isIdentifier(decl.name)) {
                        const mapped = decl.type
                            ? resolveTypeAnnotation(decl.type)
                            : mapType(checker.getTypeAtLocation(decl));
                        if (mapped) locals[decl.name.text] = mapped;
                    }
                }
            }
            t.forEachChild(node, walk);
        }
        t.forEachChild(body, walk);
        return locals;
    }

    // ── Main transform ────────────────────────────────────────────────────

    return (_ctx) => (sourceFile) => {
        if (!sourceFile.getFullText().includes("//!native")) return sourceFile;

        const sidecar: SidecarData = {};

        function visit(node: ts.Node) {
            if (t.isFunctionDeclaration(node) && node.name && node.body) {
                const params = extractParams(node);
                const returns = extractReturn(node);
                const locals = extractLocals(node.body);
                if (params.some((p) => p !== "") || returns || Object.keys(locals).length > 0)
                    sidecar[node.name.text] = { params, returns, locals };
            }

            if (t.isMethodDeclaration(node) && t.isIdentifier(node.name) && node.body) {
                const className = (node.parent as ts.ClassDeclaration).name?.text ?? "Unknown";
                const methodName = (node.name as ts.Identifier).text;
                const params = extractParams(node as ts.MethodDeclaration);
                const returns = extractReturn(node as ts.MethodDeclaration);
                const locals = extractLocals(node.body);
                if (params.some((p) => p !== "") || returns || Object.keys(locals).length > 0)
                    sidecar[`${className}.${methodName}`] = { params, returns, locals };
            }

            t.forEachChild(node, visit);
        }

        visit(sourceFile);

        if (Object.keys(sidecar).length > 0) {
            const luauPath = computeLuauPath(sourceFile.fileName, rootDir, outDir);
            const sidecarPath = computeSidecarPath(luauPath, outDir);

            // attach require path meta if user-defined types were used
            if (usedTypeNames.size > 0) {
                sidecar.__meta__ = {
                    requirePath: computeRequirePath(getTypesFilePath(), rojoEntries),
                };
            }

            fs.mkdirSync(path.dirname(sidecarPath), { recursive: true });
            fs.writeFileSync(sidecarPath, JSON.stringify(sidecar, null, 2));

            if (isWatchMode) watchAndAnnotate(luauPath, sidecarPath);
            else pendingFiles.push({ luauPath, sidecarPath });
        }

        return sourceFile;
    };
}
