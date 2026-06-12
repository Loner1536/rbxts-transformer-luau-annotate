"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformAccessExpression = transformAccessExpression;
var factory_1 = require("../../util/factory");
var diagnostics_1 = require("../../classes/diagnostics");
function transformAccessExpression(state, node) {
    var _a;
    return (_a = transformNetworkEvent(state, node)) !== null && _a !== void 0 ? _a : state.transform(node);
}
function transformNetworkEvent(state, node) {
    var type = state.typeChecker.getTypeAtLocation(node.expression);
    var hashType = state.typeChecker.getTypeOfPropertyOfType(type, "_flamework_key_obfuscation");
    if (!hashType || !hashType.isStringLiteral())
        return;
    // If the access expression doesn't have a name known at compile-time, we must throw an error.
    var name = getAccessName(node);
    if (name === undefined) {
        // This is prevents compiler errors when we're defining obfuscated objects, or accessing them internally.
        if (factory_1.f.is.elementAccessExpression(node) && factory_1.f.is.asExpression(node.argumentExpression)) {
            return;
        }
        diagnostics_1.Diagnostics.error(node, "This object has key obfuscation enabled and must be accessed directly.");
    }
    return factory_1.f.elementAccessExpression(state.transformNode(node.expression), factory_1.f.as(factory_1.f.string(state.obfuscateText(name, hashType.value)), factory_1.f.literalType(factory_1.f.string(name))), node.questionDotToken);
}
function getAccessName(node) {
    if (factory_1.f.is.propertyAccessExpression(node)) {
        return node.name.text;
    }
    else {
        if (factory_1.f.is.string(node.argumentExpression)) {
            return node.argumentExpression.text;
        }
    }
}
