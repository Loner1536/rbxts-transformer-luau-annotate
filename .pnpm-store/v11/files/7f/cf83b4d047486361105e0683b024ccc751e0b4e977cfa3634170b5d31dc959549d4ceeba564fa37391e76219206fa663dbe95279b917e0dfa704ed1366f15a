"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPathGlobIntrinsic = buildPathGlobIntrinsic;
exports.buildPathIntrinsic = buildPathIntrinsic;
var path_1 = __importDefault(require("path"));
var factory_1 = require("../../../util/factory");
var diagnostics_1 = require("../../../classes/diagnostics");
/**
 * Generates a path glob.
 *
 * This generates a string as a reference to the runtime metadata exposed in core.
 */
function buildPathGlobIntrinsic(state, node, pathType) {
    if (!pathType.isStringLiteral()) {
        diagnostics_1.Diagnostics.error(node, "Path is invalid, expected string literal and got: ".concat(state.typeChecker.typeToString(pathType)));
    }
    var file = state.getSourceFile(node);
    var glob = pathType.value;
    var absoluteGlob = glob.startsWith(".")
        ? path_1.default.relative(state.rootDirectory, path_1.default.resolve(path_1.default.dirname(file.fileName), glob)).replace(/\\/g, "/")
        : glob;
    state.buildInfo.addGlob(absoluteGlob, state.getFileId(file));
    return factory_1.f.string(state.obfuscateText(absoluteGlob, "addPaths"));
}
/**
 * Generates a path as an array.
 */
function buildPathIntrinsic(state, node, pathType) {
    var _a;
    if (!pathType.isStringLiteral()) {
        diagnostics_1.Diagnostics.error(node, "Path is invalid, expected string literal and got: ".concat(state.typeChecker.typeToString(pathType)));
    }
    var outputPath = state.pathTranslator.getOutputPath(pathType.value);
    var rbxPath = (_a = state.rojoResolver) === null || _a === void 0 ? void 0 : _a.getRbxPathFromFilePath(outputPath);
    if (!rbxPath) {
        diagnostics_1.Diagnostics.error(node, "Could not find Rojo data for '".concat(pathType.value, "'"));
    }
    return factory_1.f.array([factory_1.f.array(rbxPath.map(factory_1.f.string))]);
}
