"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inlineMacroIntrinsic = inlineMacroIntrinsic;
var factory_1 = require("../../../util/factory");
/**
 * An inlining intrinsic for basic return types.
 */
function inlineMacroIntrinsic(signature, args, parameter) {
    var parameterIndex = signature.parameters.findIndex(function (v) { var _a; return ((_a = v.valueDeclaration) === null || _a === void 0 ? void 0 : _a.symbol) === parameter; });
    var argument = args[parameterIndex];
    return factory_1.f.as(argument, signature.getDeclaration().type);
}
