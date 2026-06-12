"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformCallExpression = transformCallExpression;
var typescript_1 = __importDefault(require("typescript"));
var transformNode_1 = require("../transformNode");
var transformUserMacro_1 = require("../transformUserMacro");
var factory_1 = require("../../util/factory");
function transformCallExpression(state, node) {
    var _a;
    var symbol = state.getSymbol(node.expression);
    if (symbol) {
        if (state.isUserMacro(symbol)) {
            // We skip `super()` expressions as we likely do not have enough information to evaluate it.
            if (factory_1.f.is.superExpression(node.expression)) {
                return state.transform(node);
            }
            var signature = state.typeChecker.getResolvedSignature(node);
            if (signature) {
                return (_a = (0, transformUserMacro_1.transformUserMacro)(state, node, signature)) !== null && _a !== void 0 ? _a : state.transform(node);
            }
        }
    }
    return typescript_1.default.visitEachChild(node, function (node) { return (0, transformNode_1.transformNode)(state, node); }, state.context);
}
