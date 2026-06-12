"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryResolve = tryResolve;
exports.tryResolveTS = tryResolveTS;
var typescript_1 = __importDefault(require("typescript"));
function tryResolve(moduleName, path) {
    try {
        return require.resolve(moduleName, { paths: [path] });
    }
    catch (e) { }
}
function tryResolveTS(state, moduleName, path) {
    var _a;
    var module = typescript_1.default.resolveModuleName(moduleName, path, state.options, typescript_1.default.sys);
    return (_a = module.resolvedModule) === null || _a === void 0 ? void 0 : _a.resolvedFileName;
}
