"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAttributesAccess = isAttributesAccess;
var factory_1 = require("../factory");
var nodeMetadata_1 = require("../../classes/nodeMetadata");
/**
 * Checks if an expression is attempting to access component attributes.
 * E.g `this.attributes.myProp`
 */
function isAttributesAccess(state, expression) {
    if (!factory_1.f.is.accessExpression(expression)) {
        return false;
    }
    var lhs = state.getSymbol(expression.expression);
    if (!lhs) {
        return false;
    }
    var metadata = nodeMetadata_1.NodeMetadata.fromSymbol(state, lhs);
    if (!metadata) {
        return false;
    }
    return metadata.isRequested("intrinsic-component-attributes");
}
