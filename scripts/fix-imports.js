const { readFileSync, writeFileSync, readdirSync, statSync } = require("fs");
const { join, relative, dirname } = require("path");

const SRC = "./package/src";
const aliases = {
    api: "@api",
    binary: "@binary",
    codec: "@codec",
    transport: "@transport",
    security: "@security",
    utility: "@utility",
    constant: "@constant",
    environment: "@environment",
    type: "@type",
};

function getFiles(dir) {
    const files = [];
    for (const f of readdirSync(dir)) {
        const full = join(dir, f);
        if (statSync(full).isDirectory()) files.push(...getFiles(full));
        else if (f.endsWith(".ts")) files.push(full);
    }
    return files;
}

const DRY_RUN = false;

for (const file of getFiles(SRC)) {
    let content = readFileSync(file, "utf8");
    let changed = false;

    content = content.replace(/from "(\.\.[\/\\][^"]+)"/g, function (match, rel) {
        const abs = relative(SRC, join(dirname(file), rel)).replace(/\\/g, "/");
        for (const folder of Object.keys(aliases)) {
            const alias = aliases[folder];
            if (abs === folder) {
                changed = true;
                return 'from "' + alias + '"';
            }
            if (abs.startsWith(folder + "/")) {
                changed = true;
                return 'from "' + alias + "/" + abs.slice(folder.length + 1) + '"';
            }
        }
        return match;
    });

    if (changed) {
        console.log((DRY_RUN ? "[DRY RUN] Would update: " : "Updated: ") + file);
        if (!DRY_RUN) writeFileSync(file, content);
    }
}
