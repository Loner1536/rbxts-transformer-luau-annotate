"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSymbolIdIntrinsic = buildSymbolIdIntrinsic;
var uid_1 = require("../../../util/uid");
var factory_1 = require("../../../util/factory");
/**
 * This function differs from `Modding.Generic<T, "id">` in that it will first try to preserve the symbol information
 * provided in the type argument. If there is no type argument (e.g it was inferred), it will be equivalent to `Modding.Generic`
 *
 * This is unfortunately necessary for certain APIs as things like `typeof Decorator` will lose symbol information,
 * which can be problematic for the Modding APIs.
 */
function buildSymbolIdIntrinsic(state, node, type) {
    var _a;
    var typeArgument = (_a = node.typeArguments) === null || _a === void 0 ? void 0 : _a[0];
    if (typeArgument) {
        return factory_1.f.string((0, uid_1.getNodeUid)(state, typeArgument));
    }
    return factory_1.f.string((0, uid_1.getTypeUid)(state, type, node));
}
