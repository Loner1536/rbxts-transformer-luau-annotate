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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformNetworkingMiddlewareIntrinsic = transformNetworkingMiddlewareIntrinsic;
exports.transformObfuscatedObjectIntrinsic = transformObfuscatedObjectIntrinsic;
exports.transformShuffleArrayIntrinsic = transformShuffleArrayIntrinsic;
exports.buildDeclarationUidIntrinsic = buildDeclarationUidIntrinsic;
var typescript_1 = __importDefault(require("typescript"));
var assert_1 = __importDefault(require("assert"));
var factory_1 = require("../../../util/factory");
var diagnostics_1 = require("../../../classes/diagnostics");
var uid_1 = require("../../../util/uid");
/**
 * Obfuscates the names of events provided in networking middleware.
 *
 * This should eventually be replaced with a generic object obfuscation API.
 */
function transformNetworkingMiddlewareIntrinsic(state, signature, args, parameters) {
    var e_1, _a;
    var _loop_1 = function (parameter) {
        var parameterIndex = signature.parameters.findIndex(function (v) { var _a; return ((_a = v.valueDeclaration) === null || _a === void 0 ? void 0 : _a.symbol) === parameter; });
        var argument = args[parameterIndex];
        if (!argument || !typescript_1.default.isObjectLiteralExpression(argument)) {
            return "continue";
        }
        var obfuscateMiddleware = function (middlewareObject) {
            return factory_1.f.update.object(middlewareObject, state.obfuscateArray(middlewareObject.properties).map(function (prop) {
                if (factory_1.f.is.propertyAssignmentDeclaration(prop) && "text" in prop.name) {
                    return factory_1.f.update.propertyAssignmentDeclaration(prop, factory_1.f.is.object(prop.initializer) ? obfuscateMiddleware(prop.initializer) : prop.initializer, factory_1.f.computedPropertyName(factory_1.f.as(factory_1.f.string(state.obfuscateText(prop.name.text, "remotes")), factory_1.f.literalType(factory_1.f.string(prop.name.text)))));
                }
                return prop;
            }));
        };
        var transformedElements = argument.properties.map(function (element) {
            var name = element.name && typescript_1.default.getPropertyNameForPropertyNameNode(element.name);
            if (name !== "middleware") {
                return element;
            }
            (0, assert_1.default)(factory_1.f.is.propertyAssignmentDeclaration(element));
            var value = element.initializer;
            if (!factory_1.f.is.object(value)) {
                diagnostics_1.Diagnostics.error(value, "Networking middleware must be an object.");
            }
            return factory_1.f.update.propertyAssignmentDeclaration(element, obfuscateMiddleware(value));
        });
        args[parameterIndex] = factory_1.f.object(transformedElements, true);
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
/**
 * Obfuscates the keys of user macro metadata using the specified context.
 *
 * This should eventually be replaced with a generic object obfuscation API.
 */
function transformObfuscatedObjectIntrinsic(state, macro, hashType) {
    var e_2, _a;
    var hashContext = hashType.isStringLiteral() ? hashType.value : undefined;
    if (macro.kind === "many" && macro.members instanceof Map) {
        try {
            // Maps are order-preserving, so we can shuffle the map directly.
            for (var _b = __values(state.obfuscateArray(__spreadArray([], __read(macro.members), false))), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], inner = _d[1];
                macro.members.delete(key);
                macro.members.set(state.obfuscateText(key, hashContext), inner);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
}
/**
 * Shuffles the order of an array to prevent const-matching.
 */
function transformShuffleArrayIntrinsic(state, macro) {
    if (macro.kind === "many" && Array.isArray(macro.members)) {
        macro.members = state.obfuscateArray(macro.members);
    }
}
/**
 * Gets the ID of the macro's containing statement (e.g its variable.)
 *
 * This should eventually be replaced with a field in `Modding.Caller`
 */
function buildDeclarationUidIntrinsic(state, node) {
    var parentDeclaration = typescript_1.default.findAncestor(node, factory_1.f.is.namedDeclaration);
    if (!parentDeclaration) {
        diagnostics_1.Diagnostics.error(node, "This function must be under a variable declaration.");
    }
    return factory_1.f.string((0, uid_1.getNodeUid)(state, parentDeclaration));
}
