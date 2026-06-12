import fs from "fs";
import type { SidecarData, SidecarEntry } from "./transformer";

// ── Helpers ───────────────────────────────────────────────────────────────

function escapeRegExp(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function annotateParams(params: string, types: string[]): string {
    if (!params.trim()) return params;
    return params
        .split(",")
        .map((p, i) => {
            const param = p.trim();
            const type = types[i];
            if (!type || type === "") return param;
            // strip existing annotation (roblox-ts may have emitted one without ?)
            const baseName = param.includes(":") ? param.split(":")[0].trim() : param;
            return `${baseName}: ${type}`;
        })
        .join(", ");
}

// find the matching `end` for a function body starting at searchFrom
function findFunctionBodyEnd(content: string, searchFrom: number): number {
    const tokenRe = /\b(function|if|for|while|do|end)\b/g;
    let depth = 1;
    let expectingHeaderDo = false;

    tokenRe.lastIndex = searchFrom;
    let m: RegExpExecArray | null;
    while ((m = tokenRe.exec(content)) !== null) {
        const kw = m[1];
        switch (kw) {
            case "function":
            case "if":
                depth++;
                break;
            case "for":
            case "while":
                depth++;
                expectingHeaderDo = true;
                break;
            case "do":
                if (expectingHeaderDo) expectingHeaderDo = false;
                else depth++;
                break;
            case "end":
                depth--;
                if (depth === 0) return m.index;
                break;
        }
    }
    return -1;
}

// annotate `local x =` occurrences only within [rangeStart, rangeEnd)
function annotateLocalsInRange(
    content: string,
    rangeStart: number,
    rangeEnd: number,
    locals: Record<string, string>,
): string {
    const before = content.slice(0, rangeStart);
    let body = content.slice(rangeStart, rangeEnd);
    const after = content.slice(rangeEnd);

    for (const [varName, varType] of Object.entries(locals)) {
        const re = new RegExp(`(\\blocal ${escapeRegExp(varName)}\\b)(\\s*=)`, "g");
        body = body.replace(re, (_match, decl, eq) => `${decl}: ${varType}${eq}`);
    }

    return before + body + after;
}

// find header, annotate params + return type, then annotate locals within body
function annotateWithLocals(
    content: string,
    headerRe: RegExp,
    entry: SidecarEntry,
    wholeMatchIsGroup1 = false,
): string {
    headerRe.lastIndex = 0;
    const match = headerRe.exec(content);
    if (!match) return content;

    const fullMatch = match[0];
    const params = wholeMatchIsGroup1 ? match[2] : match[1];
    const matchStart = match.index;
    const matchEnd = matchStart + fullMatch.length;

    const annotatedParams = annotateParams(params, entry.params);
    const ret = entry.returns;

    const openIdx = fullMatch.indexOf("(");
    const open = fullMatch.slice(0, openIdx + 1);
    const newHeader = `${open}${annotatedParams})${ret ? `: ${ret}` : ""}`;

    let result = content.slice(0, matchStart) + newHeader + content.slice(matchEnd);

    const bodyStart = matchStart + newHeader.length;
    const bodyEnd = findFunctionBodyEnd(result, bodyStart);

    if (bodyEnd !== -1 && Object.keys(entry.locals).length > 0) {
        result = annotateLocalsInRange(result, bodyStart, bodyEnd, entry.locals);
    }

    return result;
}

// ── Public API ────────────────────────────────────────────────────────────

export function annotateContent(content: string, sidecar: SidecarData): string {
    for (const [key, entry] of Object.entries(sidecar)) {
        if (key === "__meta__" || !entry) continue;
        const e = entry as SidecarEntry;
        const parts = key.split(".");

        if (parts.length === 2) {
            const [className, methodName] = parts;
            const escClass = escapeRegExp(className);
            const escMethod = escapeRegExp(methodName);
            const headerRe = new RegExp(
                `function ${escClass}[:.]${escMethod}\\(((?:[^()]|\\([^()]*\\))*)\\)`,
                "g",
            );
            content = annotateWithLocals(content, headerRe, e);
        } else {
            const escFunc = escapeRegExp(parts[0]);
            const headerRe = new RegExp(
                `((?:local )?function ${escFunc}\\(((?:[^()]|\\([^()]*\\))*)\\))`,
                "g",
            );
            content = annotateWithLocals(content, headerRe, e, true);
        }
    }
    return content;
}

export function annotateFile(luauPath: string, sidecar: SidecarData) {
    let content = fs.readFileSync(luauPath, "utf8");

    const meta = sidecar.__meta__;
    if (meta?.requirePath) {
        const match = content.match(/^(--![^\n]*\n)*/);
        const pos = match ? match[0].length : 0;

        let prefix = "";
        if (meta.requirePath.includes("TS.") && !/\bTS\s*=/.test(content)) {
            prefix += `local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))\n`;
        }

        const requireExpr = meta.requirePath.startsWith("TS.")
            ? meta.requirePath
            : `require(${meta.requirePath})`;

        prefix += `local __luauAnnotateTypes = ${requireExpr}\n`;

        content = content.slice(0, pos) + prefix + content.slice(pos);
    }

    fs.writeFileSync(luauPath, annotateContent(content, sidecar));
}
