"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/* eslint-disable @typescript-eslint/no-var-requires */
var fs_1 = require("fs");
var module_1 = require("module");
var path_1 = __importDefault(require("path"));
var isPathDescendantOf_1 = require("./util/functions/isPathDescendantOf");
var logger_1 = require("./classes/logger");
var tryResolve_1 = require("./util/functions/tryResolve");
var cwd = process.cwd();
var originalRequire = module_1.Module.prototype.require;
function shouldTryHooking() {
    if (process.argv.includes("--no-flamework-hook")) {
        return false;
    }
    if (process.argv.includes("--force-flamework-hook")) {
        return true;
    }
    // Ensure we're running in the context of a project and not a multiplace repository or something,
    // as we don't have access to the project directory until roblox-ts invokes the transformer.
    if (!(0, fs_1.existsSync)(path_1.default.join(cwd, "tsconfig.json")) ||
        !(0, fs_1.existsSync)(path_1.default.join(cwd, "package.json")) ||
        !(0, fs_1.existsSync)(path_1.default.join(cwd, "node_modules"))) {
        return false;
    }
    return true;
}
function hook() {
    var robloxTsPath = (0, tryResolve_1.tryResolve)("roblox-ts", cwd);
    if (!robloxTsPath) {
        return;
    }
    var robloxTsTypeScriptPath = (0, tryResolve_1.tryResolve)("typescript", robloxTsPath);
    if (!robloxTsTypeScriptPath) {
        return;
    }
    var flameworkTypeScript = require("typescript");
    var robloxTsTypeScript = require(robloxTsTypeScriptPath);
    // Flamework and roblox-ts are referencing the same TypeScript module.
    if (flameworkTypeScript === robloxTsTypeScript) {
        return;
    }
    if (flameworkTypeScript.versionMajorMinor !== robloxTsTypeScript.versionMajorMinor) {
        if (logger_1.Logger.verbose) {
            logger_1.Logger.write("\n");
        }
        logger_1.Logger.warn("TypeScript version differs", "Flamework: v".concat(flameworkTypeScript.version, ", roblox-ts: v").concat(robloxTsTypeScript.version), "Flamework will switch to v".concat(robloxTsTypeScript.version, ", ") +
            "but you can get rid of this warning by running: npm i -D typescript@".concat(robloxTsTypeScript.version));
    }
    module_1.Module.prototype.require = function flameworkHook(id) {
        // Overwrite any Flamework TypeScript imports to roblox-ts' version.
        // To be on the safe side, this won't hook it in packages.
        if (id === "typescript" && (0, isPathDescendantOf_1.isPathDescendantOf)(this.filename, __dirname)) {
            return robloxTsTypeScript;
        }
        return originalRequire.call(this, id);
    };
}
if (shouldTryHooking()) {
    hook();
}
var transformer = require("./transformer");
// After loading Flamework, we can unhook require.
module_1.Module.prototype.require = originalRequire;
module.exports = transformer;
