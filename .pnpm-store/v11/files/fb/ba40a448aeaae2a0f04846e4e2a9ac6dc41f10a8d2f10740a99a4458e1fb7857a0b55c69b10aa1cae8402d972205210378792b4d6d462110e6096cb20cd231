"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTupleGuardsIntrinsic = buildTupleGuardsIntrinsic;
var typescript_1 = __importDefault(require("typescript"));
var diagnostics_1 = require("../../../classes/diagnostics");
var factory_1 = require("../../../util/factory");
var buildGuardFromType_1 = require("../../../util/functions/buildGuardFromType");
var isTupleType_1 = require("../../../util/functions/isTupleType");
/**
 * This intrinsic generates an array of element guards along with a rest guard for a tuple type.
 *
 * Whilst this is possible in TypeScript, it requires either slightly complex types or additional metadata.
 * This serves as a simple fast path.
 */
function buildTupleGuardsIntrinsic(state, node, tupleType) {
    var _a;
    var file = state.getSourceFile(node);
    // Tuples with only a rest element will get turned into an array
    if ((0, isTupleType_1.isArrayType)(state, tupleType)) {
        var guard = (0, buildGuardFromType_1.buildGuardFromType)(state, node, tupleType.typeArguments[0], file);
        return factory_1.f.array([factory_1.f.array([]), guard]);
    }
    if (!(0, isTupleType_1.isTupleType)(state, tupleType) || !tupleType.typeArguments) {
        diagnostics_1.Diagnostics.error(node, "Intrinsic encountered non-tuple type: ".concat(state.typeChecker.typeToString(tupleType)));
    }
    var guards = new Array();
    var restGuard = factory_1.f.nil();
    for (var i = 0; i < tupleType.typeArguments.length; i++) {
        var element = tupleType.typeArguments[i];
        var declaration = (_a = tupleType.target.labeledElementDeclarations) === null || _a === void 0 ? void 0 : _a[i];
        var guard = (0, buildGuardFromType_1.buildGuardFromType)(state, declaration !== null && declaration !== void 0 ? declaration : node, element, file);
        if (tupleType.target.elementFlags[i] & typescript_1.default.ElementFlags.Rest) {
            restGuard = guard;
        }
        else {
            guards.push(guard);
        }
    }
    return factory_1.f.array([factory_1.f.array(guards), restGuard]);
}
