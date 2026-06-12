"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParameterConstIntrinsic = validateParameterConstIntrinsic;
var typescript_1 = __importDefault(require("typescript"));
var diagnostics_1 = require("../../../classes/diagnostics");
/**
 * Validates that the specified parameters can be inspected at compile-time (up to a depth of 1)
 */
function validateParameterConstIntrinsic(node, signature, parameters) {
    var e_1, _a;
    var _b, _c;
    var _loop_1 = function (parameter) {
        var e_2, _d;
        var parameterIndex = signature.parameters.findIndex(function (v) { var _a; return ((_a = v.valueDeclaration) === null || _a === void 0 ? void 0 : _a.symbol) === parameter; });
        var argument = (_b = node.arguments) === null || _b === void 0 ? void 0 : _b[parameterIndex];
        if (!argument) {
            return "continue";
        }
        // Check if the argument is a literal (string, number, etc)
        if (typescript_1.default.isLiteralExpression(argument)) {
            return "continue";
        }
        var elements = typescript_1.default.isObjectLiteralExpression(argument)
            ? argument.properties
            : typescript_1.default.isArrayLiteralExpression(argument)
                ? argument.elements
                : undefined;
        var parameterDiagnostic = diagnostics_1.Diagnostics.createDiagnostic((_c = parameter.valueDeclaration) !== null && _c !== void 0 ? _c : argument, typescript_1.default.DiagnosticCategory.Message, "Required because this parameter must be known at compile-time.");
        // This argument is not an object or array literal.
        if (!elements) {
            var baseDiagnostic = diagnostics_1.Diagnostics.createDiagnostic(argument, typescript_1.default.DiagnosticCategory.Error, "Flamework expected this argument to be a literal expression.");
            typescript_1.default.addRelatedInfo(baseDiagnostic, parameterDiagnostic);
            throw new diagnostics_1.DiagnosticError(baseDiagnostic);
        }
        try {
            // We also want to validate that there are no spread operations inside the literal.
            for (var elements_1 = (e_2 = void 0, __values(elements)), elements_1_1 = elements_1.next(); !elements_1_1.done; elements_1_1 = elements_1.next()) {
                var element = elements_1_1.value;
                if (typescript_1.default.isSpreadElement(element) || typescript_1.default.isSpreadAssignment(element)) {
                    var baseDiagnostic = diagnostics_1.Diagnostics.createDiagnostic(element, typescript_1.default.DiagnosticCategory.Error, "Flamework does not support spread expressions in this location.");
                    typescript_1.default.addRelatedInfo(baseDiagnostic, parameterDiagnostic);
                    throw new diagnostics_1.DiagnosticError(baseDiagnostic);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (elements_1_1 && !elements_1_1.done && (_d = elements_1.return)) _d.call(elements_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    try {
        for (var parameters_1 = __values(parameters), parameters_1_1 = parameters_1.next(); !parameters_1_1.done; parameters_1_1 = parameters_1.next()) {
            var parameter = parameters_1_1.value;
            _loop_1(parameter);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (parameters_1_1 && !parameters_1_1.done && (_a = parameters_1.return)) _a.call(parameters_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
