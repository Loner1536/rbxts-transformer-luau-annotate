import type ts from "typescript";

// ── IR ────────────────────────────────────────────────────────────────────

export type LuauIR =
    | { kind: "primitive"; name: string }
    | { kind: "optional"; inner: LuauIR }
    | { kind: "array"; element: LuauIR }
    | { kind: "map"; key: LuauIR; value: LuauIR }
    | { kind: "set"; key: LuauIR }
    | { kind: "union"; types: LuauIR[] }
    | { kind: "intersection"; types: LuauIR[] }
    | { kind: "object"; fields: ObjectField[]; indexSig?: IndexSig }
    | { kind: "function"; params: FuncParam[]; returns: LuauIR }
    | { kind: "reference"; name: string; typeArgs?: LuauIR[] }
    | { kind: "conditional"; trueBranch: LuauIR; falseBranch: LuauIR }
    | { kind: "tuple"; elements: LuauIR[] }
    | { kind: "any" }
    | { kind: "void" }
    | { kind: "never" };

export type ObjectField = { name: string; optional: boolean; type: LuauIR };
export type FuncParam = { name: string; type: LuauIR };
export type IndexSig = { key: LuauIR; value: LuauIR };

export type TypeDecl = {
    name: string;
    typeParams: string[];
    body: LuauIR;
    original: string;
};

// ── Scalar map ────────────────────────────────────────────────────────────

const SCALAR: Record<string, string> = {
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
};

// ── Main conversion ────────────────────────────────────────────────────────

export function typeNodeToIR(
    node: ts.TypeNode,
    checker: ts.TypeChecker,
    t: typeof ts,
    typeParams: Set<string>,
    registry: Map<string, TypeDecl>,
    selfName?: string,
): LuauIR {
    const k = node.kind;

    if (k === t.SyntaxKind.StringKeyword) return { kind: "primitive", name: "string" };
    if (k === t.SyntaxKind.NumberKeyword) return { kind: "primitive", name: "number" };
    if (k === t.SyntaxKind.BooleanKeyword) return { kind: "primitive", name: "boolean" };
    if (k === t.SyntaxKind.VoidKeyword) return { kind: "void" };
    if (k === t.SyntaxKind.AnyKeyword || k === t.SyntaxKind.UnknownKeyword) return { kind: "any" };
    if (k === t.SyntaxKind.NeverKeyword) return { kind: "never" };
    if (k === t.SyntaxKind.UndefinedKeyword || k === t.SyntaxKind.NullKeyword) {
        return { kind: "optional", inner: { kind: "any" } };
    }

    if (t.isLiteralTypeNode(node)) {
        const lit = (node as ts.LiteralTypeNode).literal;
        if (lit.kind === t.SyntaxKind.StringLiteral) return { kind: "primitive", name: "string" };
        if (lit.kind === t.SyntaxKind.NumericLiteral) return { kind: "primitive", name: "number" };
        if (lit.kind === t.SyntaxKind.TrueKeyword || lit.kind === t.SyntaxKind.FalseKeyword)
            return { kind: "primitive", name: "boolean" };
        return { kind: "any" };
    }

    if (t.isArrayTypeNode(node)) {
        return {
            kind: "array",
            element: typeNodeToIR(
                (node as ts.ArrayTypeNode).elementType,
                checker,
                t,
                typeParams,
                registry,
                selfName,
            ),
        };
    }

    if (k === t.SyntaxKind.TupleType) {
        const elements = (node as ts.TupleTypeNode).elements.map((e) => {
            const en = (
                t.isNamedTupleMember?.(e) ? (e as unknown as { type: ts.TypeNode }).type : e
            ) as ts.TypeNode;
            return typeNodeToIR(en, checker, t, typeParams, registry, selfName);
        });
        return { kind: "tuple", elements };
    }

    if (t.isUnionTypeNode(node)) {
        const { types } = node as ts.UnionTypeNode;
        const isNull = (n: ts.TypeNode) =>
            n.kind === t.SyntaxKind.UndefinedKeyword || n.kind === t.SyntaxKind.NullKeyword;
        const hasNull = types.some(isNull);
        const nonNull = types.filter((n) => !isNull(n));
        if (nonNull.length === 0) return { kind: "any" };

        const allStrLit = nonNull.every(
            (n) =>
                t.isLiteralTypeNode(n) &&
                (n as ts.LiteralTypeNode).literal.kind === t.SyntaxKind.StringLiteral,
        );
        if (allStrLit) {
            const inner: LuauIR = { kind: "primitive", name: "string" };
            return hasNull ? { kind: "optional", inner } : inner;
        }

        const mapped = nonNull.map((n) =>
            typeNodeToIR(n, checker, t, typeParams, registry, selfName),
        );
        const inner: LuauIR = mapped.length === 1 ? mapped[0] : { kind: "union", types: mapped };
        return hasNull ? { kind: "optional", inner } : inner;
    }

    if (t.isIntersectionTypeNode(node)) {
        const types = (node as ts.IntersectionTypeNode).types.map((n) =>
            typeNodeToIR(n, checker, t, typeParams, registry, selfName),
        );
        return { kind: "intersection", types };
    }

    if (t.isTypeLiteralNode(node)) {
        return typeLiteralToIR(
            node as ts.TypeLiteralNode,
            checker,
            t,
            typeParams,
            registry,
            selfName,
        );
    }

    if (t.isFunctionTypeNode(node)) {
        const fn = node as ts.FunctionTypeNode;
        const params: FuncParam[] = fn.parameters.map((p) => ({
            name: t.isIdentifier(p.name) ? (p.name as ts.Identifier).text : "_",
            type: p.type
                ? typeNodeToIR(p.type, checker, t, typeParams, registry, selfName)
                : { kind: "any" },
        }));
        const returns = typeNodeToIR(fn.type, checker, t, typeParams, registry, selfName);
        return { kind: "function", params, returns };
    }

    if (k === t.SyntaxKind.ConditionalType) {
        const cond = node as ts.ConditionalTypeNode;
        const isVoidExtends =
            cond.extendsType.kind === t.SyntaxKind.VoidKeyword ||
            cond.extendsType.kind === t.SyntaxKind.UndefinedKeyword;
        const trueBranch = typeNodeToIR(cond.trueType, checker, t, typeParams, registry, selfName);
        const falseBranch = typeNodeToIR(
            cond.falseType,
            checker,
            t,
            typeParams,
            registry,
            selfName,
        );
        if (isVoidExtends) return { kind: "conditional", trueBranch, falseBranch };
        return { kind: "any" };
    }

    if (t.isTypeReferenceNode(node)) {
        return typeRefToIR(
            node as ts.TypeReferenceNode,
            checker,
            t,
            typeParams,
            registry,
            selfName,
        );
    }

    return { kind: "any" };
}

// ── Type literal ──────────────────────────────────────────────────────────

function typeLiteralToIR(
    node: ts.TypeLiteralNode,
    checker: ts.TypeChecker,
    t: typeof ts,
    typeParams: Set<string>,
    registry: Map<string, TypeDecl>,
    selfName?: string,
): LuauIR {
    const fields: ObjectField[] = [];
    let indexSig: IndexSig | undefined;

    for (const member of node.members) {
        if (t.isPropertySignature(member) && member.name) {
            const name = member.name.getText();
            const optional = member.questionToken !== undefined;
            const type = member.type
                ? typeNodeToIR(member.type, checker, t, typeParams, registry, selfName)
                : { kind: "any" as const };
            fields.push({ name, optional, type });
        } else if (t.isMethodSignature(member) && member.name) {
            const name = member.name.getText();
            const optional = member.questionToken !== undefined;
            const params: FuncParam[] = (member as ts.MethodSignature).parameters.map((p) => ({
                name: t.isIdentifier(p.name) ? (p.name as ts.Identifier).text : "_",
                type: p.type
                    ? typeNodeToIR(p.type, checker, t, typeParams, registry, selfName)
                    : { kind: "any" as const },
            }));
            const ret = (member as ts.MethodSignature).type;
            const returns: LuauIR = ret
                ? typeNodeToIR(ret, checker, t, typeParams, registry, selfName)
                : { kind: "void" };
            const self: FuncParam = {
                name: "self",
                type: selfName ? { kind: "reference", name: selfName } : { kind: "any" },
            };
            fields.push({
                name,
                optional,
                type: { kind: "function", params: [self, ...params], returns },
            });
        } else if (t.isIndexSignatureDeclaration(member)) {
            const param = (member as ts.IndexSignatureDeclaration).parameters[0];
            const key = param?.type
                ? typeNodeToIR(param.type, checker, t, typeParams, registry, selfName)
                : ({ kind: "primitive", name: "string" } as const);
            const value = (member as ts.IndexSignatureDeclaration).type
                ? typeNodeToIR(
                    (member as ts.IndexSignatureDeclaration).type,
                    checker,
                    t,
                    typeParams,
                    registry,
                    selfName,
                )
                : ({ kind: "any" } as const);
            indexSig = { key, value };
        }
    }

    return { kind: "object", fields, indexSig };
}

// ── Type reference ────────────────────────────────────────────────────────

function typeRefToIR(
    node: ts.TypeReferenceNode,
    checker: ts.TypeChecker,
    t: typeof ts,
    typeParams: Set<string>,
    registry: Map<string, TypeDecl>,
    selfName?: string,
): LuauIR {
    const name = t.isIdentifier(node.typeName)
        ? (node.typeName as ts.Identifier).text
        : (node.typeName as ts.QualifiedName).right.text;

    // generic type parameter
    if (typeParams.has(name)) return { kind: "reference", name };

    // scalar / roblox
    if (SCALAR[name]) return { kind: "primitive", name: SCALAR[name] };

    const args = (node.typeArguments ?? []).map((a) =>
        typeNodeToIR(a, checker, t, typeParams, registry, selfName),
    );

    // built-ins
    if (name === "Array" || name === "ReadonlyArray")
        return { kind: "array", element: args[0] ?? { kind: "any" } };
    if (name === "Map" || name === "ReadonlyMap")
        return { kind: "map", key: args[0] ?? { kind: "any" }, value: args[1] ?? { kind: "any" } };
    if (name === "Set" || name === "ReadonlySet")
        return { kind: "set", key: args[0] ?? { kind: "any" } };
    if (name === "Record")
        return { kind: "map", key: args[0] ?? { kind: "any" }, value: args[1] ?? { kind: "any" } };
    if (name === "Readonly" || name === "NonNullable") return args[0] ?? { kind: "any" };
    if (name === "Partial") {
        const inner = args[0];
        if (inner?.kind === "object")
            return {
                kind: "object",
                fields: inner.fields.map((f) => ({ ...f, optional: true })),
                indexSig: inner.indexSig,
            };
        return inner ?? { kind: "any" };
    }
    if (name === "Required") {
        const inner = args[0];
        if (inner?.kind === "object")
            return {
                kind: "object",
                fields: inner.fields.map((f) => ({ ...f, optional: false })),
                indexSig: inner.indexSig,
            };
        return inner ?? { kind: "any" };
    }
    if (name === "LuaTuple") {
        const inner = args[0];
        if (inner?.kind === "tuple") return { kind: "tuple", elements: inner.elements };
        return inner ?? { kind: "any" };
    }

    // qualified name: Namespace.Type → Namespace_Type
    let qualifiedName: string;
    if (!t.isIdentifier(node.typeName)) {
        const qn = node.typeName as ts.QualifiedName;
        qualifiedName = `${qn.left.getText()}_${name}`;
    } else {
        qualifiedName = name;
    }

    // try to extract user-defined type
    tryExtract(node.typeName, checker, t, registry, qualifiedName);

    return { kind: "reference", name: qualifiedName, typeArgs: args.length > 0 ? args : undefined };
}

// ── Extraction ────────────────────────────────────────────────────────────

function tryExtract(
    nameNode: ts.EntityName,
    checker: ts.TypeChecker,
    t: typeof ts,
    registry: Map<string, TypeDecl>,
    qualifiedName: string,
) {
    if (registry.has(qualifiedName)) return;
    const sym = checker.getSymbolAtLocation(nameNode);
    if (!sym) return;
    const decls = sym.declarations;
    if (!decls || decls.length === 0) return;
    const decl = decls[0];
    if (t.isInterfaceDeclaration(decl) || t.isTypeAliasDeclaration(decl)) {
        extractDecl(
            decl as ts.InterfaceDeclaration | ts.TypeAliasDeclaration,
            checker,
            t,
            registry,
            qualifiedName,
        );
    }
}

export function extractDecl(
    decl: ts.InterfaceDeclaration | ts.TypeAliasDeclaration,
    checker: ts.TypeChecker,
    t: typeof ts,
    registry: Map<string, TypeDecl>,
    name: string,
) {
    if (registry.has(name)) return;

    const typeParamNames = new Set(
        (decl.typeParameters ?? []).map((tp) => (tp.name as ts.Identifier).text),
    );
    const typeParamList = [...typeParamNames];

    // placeholder to prevent infinite recursion
    registry.set(name, { name, typeParams: typeParamList, body: { kind: "any" }, original: name });

    let body: LuauIR;

    if (t.isInterfaceDeclaration(decl)) {
        const fields: ObjectField[] = [];
        let indexSig: IndexSig | undefined;

        for (const member of (decl as ts.InterfaceDeclaration).members) {
            if (t.isPropertySignature(member) && member.name) {
                const fieldName = member.name.getText();
                const optional = member.questionToken !== undefined;
                const type = member.type
                    ? typeNodeToIR(member.type, checker, t, typeParamNames, registry, name)
                    : { kind: "any" as const };
                fields.push({ name: fieldName, optional, type });
            } else if (t.isMethodSignature(member) && member.name) {
                const fieldName = member.name.getText();
                const optional = member.questionToken !== undefined;
                const params: FuncParam[] = (member as ts.MethodSignature).parameters.map((p) => ({
                    name: t.isIdentifier(p.name) ? (p.name as ts.Identifier).text : "_",
                    type: p.type
                        ? typeNodeToIR(p.type, checker, t, typeParamNames, registry, name)
                        : { kind: "any" as const },
                }));
                const ret = (member as ts.MethodSignature).type;
                const returns: LuauIR = ret
                    ? typeNodeToIR(ret, checker, t, typeParamNames, registry, name)
                    : { kind: "void" };
                const self: FuncParam = {
                    name: "self",
                    type:
                        typeParamList.length > 0
                            ? {
                                kind: "reference",
                                name,
                                typeArgs: typeParamList.map((p) => ({
                                    kind: "reference" as const,
                                    name: p,
                                })),
                            }
                            : { kind: "reference", name },
                };
                fields.push({
                    name: fieldName,
                    optional,
                    type: { kind: "function", params: [self, ...params], returns },
                });
            } else if (t.isIndexSignatureDeclaration(member)) {
                const param = (member as ts.IndexSignatureDeclaration).parameters[0];
                const key = param?.type
                    ? typeNodeToIR(param.type, checker, t, typeParamNames, registry, name)
                    : ({ kind: "primitive", name: "string" } as const);
                const value = (member as ts.IndexSignatureDeclaration).type
                    ? typeNodeToIR(
                        (member as ts.IndexSignatureDeclaration).type,
                        checker,
                        t,
                        typeParamNames,
                        registry,
                        name,
                    )
                    : ({ kind: "any" } as const);
                indexSig = { key, value };
            }
        }

        body = { kind: "object", fields, indexSig };
    } else {
        // TypeAliasDeclaration
        const alias = decl as ts.TypeAliasDeclaration;
        body = typeNodeToIR(alias.type, checker, t, typeParamNames, registry, name);

        // top-level conditional → split into _void and _data variants + intersection
        if (body.kind === "conditional") {
            const voidName = `${name}_void`;
            const dataName = `${name}_data`;
            registry.set(voidName, {
                name: voidName,
                typeParams: [],
                body: body.trueBranch,
                original: `${name} (void)`,
            });
            registry.set(dataName, {
                name: dataName,
                typeParams: typeParamList,
                body: body.falseBranch,
                original: `${name} (data)`,
            });
            body = {
                kind: "intersection",
                types: [
                    { kind: "reference", name: voidName },
                    {
                        kind: "reference",
                        name: dataName,
                        typeArgs: typeParamList.map((p) => ({ kind: "reference", name: p })),
                    },
                ],
            };
        }
    }

    registry.set(name, { name, typeParams: typeParamList, body, original: name });
}
