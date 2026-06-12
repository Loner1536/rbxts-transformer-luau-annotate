"use strict";
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
exports.transformUserMacro = transformUserMacro;
var crypto_1 = require("crypto");
var typescript_1 = __importDefault(require("typescript"));
var diagnostics_1 = require("../classes/diagnostics");
var factory_1 = require("../util/factory");
var buildGuardFromType_1 = require("../util/functions/buildGuardFromType");
var uid_1 = require("../util/uid");
var nodeMetadata_1 = require("../classes/nodeMetadata");
var paths_1 = require("./macros/intrinsics/paths");
var parameters_1 = require("./macros/intrinsics/parameters");
var networking_1 = require("./macros/intrinsics/networking");
var guards_1 = require("./macros/intrinsics/guards");
var isTupleType_1 = require("../util/functions/isTupleType");
var inlining_1 = require("./macros/intrinsics/inlining");
var symbol_1 = require("./macros/intrinsics/symbol");
function transformUserMacro(state, node, signature) {
    var _a, _b;
    var file = state.getSourceFile(node);
    var signatureDeclaration = signature.getDeclaration();
    var nodeMetadata = new nodeMetadata_1.NodeMetadata(state, signatureDeclaration);
    var args = node.arguments ? __spreadArray([], __read(node.arguments), false) : [];
    var parameters = new Map();
    var highestParameterIndex = -1;
    for (var i = 0; i < getParameterCount(state, signature); i++) {
        // This parameter is passed explicitly, so we don't need to evaluate it.
        if (!isUndefinedArgument(args[i])) {
            continue;
        }
        var targetParameter = state.typeChecker.getParameterType(signature, i).getNonNullableType();
        var userMacro = getUserMacroOfUnion(state, node, targetParameter);
        if (userMacro) {
            parameters.set(i, userMacro);
            highestParameterIndex = Math.max(highestParameterIndex, i);
        }
    }
    for (var i = 0; i <= highestParameterIndex; i++) {
        var userMacro = parameters.get(i);
        if (userMacro) {
            args[i] = buildUserMacro(state, node, userMacro);
        }
        else {
            args[i] = args[i] ? state.transform(args[i]) : factory_1.f.nil();
        }
    }
    var networkingMiddleware = nodeMetadata.getSymbol("intrinsic-middleware");
    if (networkingMiddleware) {
        (0, networking_1.transformNetworkingMiddlewareIntrinsic)(state, signature, args, networkingMiddleware);
    }
    var inlineIntrinsic = nodeMetadata.getSymbol("intrinsic-inline");
    if (inlineIntrinsic && inlineIntrinsic.length === 1) {
        return (0, inlining_1.inlineMacroIntrinsic)(signature, args, inlineIntrinsic[0]);
    }
    (0, parameters_1.validateParameterConstIntrinsic)(node, signature, (_a = nodeMetadata.getSymbol("intrinsic-const")) !== null && _a !== void 0 ? _a : []);
    var name;
    var rewrite = (_b = nodeMetadata.getSymbol("intrinsic-flamework-rewrite")) === null || _b === void 0 ? void 0 : _b[0];
    if (rewrite && rewrite.parent) {
        var namespace = state.addFileImport(file, "@flamework/core", rewrite.parent.name);
        name = factory_1.f.elementAccessExpression(namespace, rewrite.name);
    }
    if (!name) {
        name = state.transformNode(node.expression);
    }
    if (nodeMetadata.isRequested("intrinsic-arg-shift")) {
        args.shift();
    }
    if (typescript_1.default.isNewExpression(node)) {
        return typescript_1.default.factory.updateNewExpression(node, name, node.typeArguments, args);
    }
    else if (typescript_1.default.isCallExpression(node)) {
        return typescript_1.default.factory.updateCallExpression(node, name, node.typeArguments, args);
    }
    else {
        diagnostics_1.Diagnostics.error(node, "Macro could not be transformed.");
    }
}
function isUndefinedArgument(argument) {
    return argument ? factory_1.f.is.identifier(argument) && argument.text === "undefined" : true;
}
function getLabels(state, type) {
    var e_1, _a;
    if (!(0, isTupleType_1.isTupleType)(state, type)) {
        return {
            kind: "literal",
            value: undefined,
        };
    }
    var names = new Array();
    var declarations = type.target.labeledElementDeclarations;
    if (!declarations) {
        return {
            kind: "literal",
            value: undefined,
        };
    }
    try {
        for (var declarations_1 = __values(declarations), declarations_1_1 = declarations_1.next(); !declarations_1_1.done; declarations_1_1 = declarations_1.next()) {
            var namedMember = declarations_1_1.value;
            // TypeScript 5.0+ allows nameless tuple elements, so we'll default to an empty string in that case.
            names.push({
                kind: "literal",
                value: namedMember ? namedMember.name.text : "",
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (declarations_1_1 && !declarations_1_1.done && (_a = declarations_1.return)) _a.call(declarations_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return {
        kind: "many",
        members: names,
    };
}
function buildUserMacro(state, node, macro) {
    var e_2, _a;
    if (macro.kind === "generic") {
        var metadata = getGenericMetadata(macro);
        if (metadata) {
            return factory_1.f.asNever(metadata);
        }
    }
    else if (macro.kind === "caller") {
        var metadata = getCallerMetadata(macro);
        if (metadata) {
            return factory_1.f.asNever(metadata);
        }
    }
    else if (macro.kind === "many") {
        if (Array.isArray(macro.members)) {
            return factory_1.f.asNever(factory_1.f.array(macro.members.map(function (userMacro) { return buildUserMacro(state, node, userMacro); })));
        }
        else {
            var elements = new Array();
            try {
                for (var _b = __values(macro.members), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), name_1 = _d[0], userMacro = _d[1];
                    var expression = buildUserMacro(state, node, userMacro);
                    if (factory_1.f.is.nil(expression.expression)) {
                        continue;
                    }
                    elements.push(factory_1.f.propertyAssignmentDeclaration(factory_1.f.string(name_1), expression));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return factory_1.f.asNever(factory_1.f.object(elements, false));
        }
    }
    else if (macro.kind === "literal") {
        var value = macro.value;
        return factory_1.f.asNever(typeof value === "string"
            ? factory_1.f.string(value)
            : typeof value === "number"
                ? factory_1.f.number(value)
                : typeof value === "boolean"
                    ? factory_1.f.bool(value)
                    : factory_1.f.nil());
    }
    else if (macro.kind === "intrinsic") {
        return factory_1.f.asNever(buildIntrinsicMacro(state, node, macro));
    }
    return factory_1.f.asNever(factory_1.f.nil());
    function getGenericMetadata(macro) {
        if (macro.metadata === "id") {
            return factory_1.f.string((0, uid_1.getTypeUid)(state, macro.target, node));
        }
        if (macro.metadata === "guard") {
            var result = (0, buildGuardFromType_1.buildGuardFromTypeWithDedup)(state, node, macro.target);
            state.prereqList(result.statements);
            return result.guard;
        }
        if (macro.metadata === "text") {
            return factory_1.f.string(state.typeChecker.typeToString(macro.target));
        }
    }
    function getCallerMetadata(macro) {
        var lineAndCharacter = typescript_1.default.getLineAndCharacterOfPosition(node.getSourceFile(), node.getStart());
        if (macro.metadata === "line") {
            return factory_1.f.number(lineAndCharacter.line + 1);
        }
        if (macro.metadata === "character") {
            return factory_1.f.number(lineAndCharacter.character + 1);
        }
        if (macro.metadata === "width") {
            return factory_1.f.number(node.getWidth());
        }
        if (macro.metadata === "uuid") {
            return factory_1.f.string((0, crypto_1.randomUUID)());
        }
        if (macro.metadata === "text") {
            return factory_1.f.string(node.getText());
        }
    }
}
function buildIntrinsicMacro(state, node, macro) {
    if (macro.id === "pathglob") {
        var _a = __read(macro.inputs, 1), pathType = _a[0];
        if (!pathType) {
            throw new Error("Invalid intrinsic usage");
        }
        return (0, paths_1.buildPathGlobIntrinsic)(state, node, pathType);
    }
    if (macro.id === "path") {
        var _b = __read(macro.inputs, 1), pathType = _b[0];
        if (!pathType) {
            throw new Error("Invalid intrinsic usage");
        }
        return (0, paths_1.buildPathIntrinsic)(state, node, pathType);
    }
    if (macro.id === "obfuscate-obj") {
        var _c = __read(macro.inputs, 2), macroType = _c[0], hashType = _c[1];
        if (!macroType || !hashType) {
            throw new Error("Invalid intrinsic usage");
        }
        var innerMacro = getUserMacroOfMany(state, node, macroType);
        if (!innerMacro) {
            throw new Error("Intrinsic obfuscate-obj received no inner macro.");
        }
        (0, networking_1.transformObfuscatedObjectIntrinsic)(state, innerMacro, hashType);
        return buildUserMacro(state, node, innerMacro);
    }
    if (macro.id === "shuffle-array") {
        var _d = __read(macro.inputs, 1), macroType = _d[0];
        if (!macroType) {
            throw new Error("Invalid intrinsic usage");
        }
        var innerMacro = getUserMacroOfMany(state, node, macroType);
        if (!innerMacro) {
            throw new Error("Intrinsic obfuscate-obj received no inner macro.");
        }
        (0, networking_1.transformShuffleArrayIntrinsic)(state, innerMacro);
        return buildUserMacro(state, node, innerMacro);
    }
    if (macro.id === "tuple-guards") {
        var _e = __read(macro.inputs, 1), tupleType = _e[0];
        if (!tupleType) {
            throw new Error("Invalid intrinsic usage");
        }
        return (0, guards_1.buildTupleGuardsIntrinsic)(state, node, tupleType);
    }
    if (macro.id === "declaration-uid") {
        return (0, networking_1.buildDeclarationUidIntrinsic)(state, node);
    }
    if (macro.id === "symbol-id") {
        var _f = __read(macro.inputs, 1), type = _f[0];
        if (!type || !factory_1.f.is.call(node)) {
            throw new Error("Invalid intrinsic usage");
        }
        return (0, symbol_1.buildSymbolIdIntrinsic)(state, node, type);
    }
    throw "Unexpected intrinsic ID '".concat(macro.id, "' with ").concat(macro.inputs.length, " inputs");
}
function getMetadataFromType(metadataType) {
    if (metadataType.isStringLiteral()) {
        return metadataType.value;
    }
}
function getUserMacroOfMany(state, node, target) {
    var e_3, _a, e_4, _b, e_5, _c;
    var basicUserMacro = getBasicUserMacro(state, node, target);
    if (basicUserMacro) {
        return basicUserMacro;
    }
    var manyMetadata = state.typeChecker.getTypeOfPropertyOfType(target, "_flamework_macro_many");
    if (manyMetadata) {
        return getUserMacroOfMany(state, node, manyMetadata);
    }
    if ((0, isTupleType_1.isTupleType)(state, target)) {
        var userMacros = new Array();
        try {
            for (var _d = __values(state.typeChecker.getTypeArguments(target)), _e = _d.next(); !_e.done; _e = _d.next()) {
                var member = _e.value;
                var userMacro = getUserMacroOfMany(state, node, member);
                if (!userMacro)
                    return;
                userMacros.push(userMacro);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return {
            kind: "many",
            members: userMacros,
        };
    }
    else if (state.typeChecker.isArrayType(target)) {
        var targetType = state.typeChecker.getTypeArguments(target)[0];
        var constituents = targetType.isUnion() ? targetType.types : [targetType];
        var userMacros = new Array();
        try {
            for (var constituents_1 = __values(constituents), constituents_1_1 = constituents_1.next(); !constituents_1_1.done; constituents_1_1 = constituents_1.next()) {
                var member = constituents_1_1.value;
                // `never` may be encountered when a union has no constituents, so we should just return an empty array.
                if (member.flags & typescript_1.default.TypeFlags.Never) {
                    break;
                }
                var userMacro = getUserMacroOfMany(state, node, member);
                if (!userMacro)
                    return;
                userMacros.push(userMacro);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (constituents_1_1 && !constituents_1_1.done && (_b = constituents_1.return)) _b.call(constituents_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return {
            kind: "many",
            members: userMacros,
        };
    }
    else if (isObjectType(target)) {
        var userMacros = new Map();
        try {
            for (var _f = __values(target.getProperties()), _g = _f.next(); !_g.done; _g = _f.next()) {
                var member = _g.value;
                var memberType = state.typeChecker.getTypeOfPropertyOfType(target, member.name);
                if (!memberType)
                    return;
                var userMacro = getUserMacroOfMany(state, node, memberType);
                if (!userMacro)
                    return;
                userMacros.set(member.name, userMacro);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return {
            kind: "many",
            members: userMacros,
        };
    }
    else if (target.isStringLiteral() || target.isNumberLiteral()) {
        return {
            kind: "literal",
            value: target.value,
        };
    }
    else if (target.flags & typescript_1.default.TypeFlags.Undefined) {
        return {
            kind: "literal",
            value: undefined,
        };
    }
    else if (target.flags & typescript_1.default.TypeFlags.BooleanLiteral) {
        return {
            kind: "literal",
            value: target.regularType === state.typeChecker.getTrueType() ? true : false,
        };
    }
    diagnostics_1.Diagnostics.error(node, "Unknown type '".concat(target.checker.typeToString(target), "' encountered"));
}
function getBasicUserMacro(state, node, target) {
    var genericMetadata = state.typeChecker.getTypeOfPropertyOfType(target, "_flamework_macro_generic");
    if (genericMetadata) {
        var targetType = state.typeChecker.getTypeOfPropertyOfType(genericMetadata, "0");
        var metadataType = state.typeChecker.getTypeOfPropertyOfType(genericMetadata, "1");
        if (!targetType)
            return;
        if (!metadataType)
            return;
        var metadata = getMetadataFromType(metadataType);
        if (!metadata) {
            diagnostics_1.Diagnostics.error(node, "Flamework encountered invalid metadata: '".concat(state.typeChecker.typeToString(metadataType), "'"));
        }
        return {
            kind: "generic",
            target: targetType,
            metadata: metadata,
        };
    }
    var callerMetadata = state.typeChecker.getTypeOfPropertyOfType(target, "_flamework_macro_caller");
    if (callerMetadata) {
        var metadata = getMetadataFromType(callerMetadata);
        if (!metadata)
            return;
        return {
            kind: "caller",
            metadata: metadata,
        };
    }
    var hashMetadata = state.typeChecker.getTypeOfPropertyOfType(target, "_flamework_macro_hash");
    if (hashMetadata) {
        var text = state.typeChecker.getTypeOfPropertyOfType(hashMetadata, "0");
        var context = state.typeChecker.getTypeOfPropertyOfType(hashMetadata, "1");
        var isObfuscation = state.typeChecker.getTypeOfPropertyOfType(hashMetadata, "2");
        if (!text || !text.isStringLiteral())
            return;
        if (!context)
            return;
        var contextName = context.isStringLiteral() ? context.value : "@";
        return {
            kind: "literal",
            value: isObfuscation
                ? state.obfuscateText(text.value, contextName)
                : state.buildInfo.hashString(text.value, contextName),
        };
    }
    var nonNullableTarget = target.getNonNullableType();
    var labelMetadata = state.typeChecker.getTypeOfPropertyOfType(nonNullableTarget, "_flamework_macro_tuple_labels");
    if (labelMetadata) {
        return getLabels(state, labelMetadata);
    }
    var intrinsicMetadata = state.typeChecker.getTypeOfPropertyOfType(nonNullableTarget, "_flamework_intrinsic");
    if (intrinsicMetadata) {
        if ((0, isTupleType_1.isTupleType)(state, intrinsicMetadata) && intrinsicMetadata.typeArguments) {
            var _a = __read(intrinsicMetadata.typeArguments), id = _a[0], inputs = _a.slice(1);
            if (!id || !id.isStringLiteral())
                return;
            return {
                kind: "intrinsic",
                id: id.value,
                inputs: inputs,
            };
        }
    }
}
function getUserMacroOfType(state, node, target) {
    var manyMetadata = state.typeChecker.getTypeOfPropertyOfType(target, "_flamework_macro_many");
    if (manyMetadata) {
        return getUserMacroOfMany(state, node, manyMetadata);
    }
    else {
        return getBasicUserMacro(state, node, target);
    }
}
/**
 * This allows user macros to specify signatures that can accept non-metadata, like in Flamework components.
 * Multiple modding types in a single parameter aren't supported, and Flamework will choose a random one.
 *
 * For example, `string | Modding.Generic<T, "id">`, will generate the ID for `T`, but also allow users to pass in one manually.
 */
function getUserMacroOfUnion(state, node, target) {
    var e_6, _a;
    if (!target.isUnion()) {
        return getUserMacroOfType(state, node, target);
    }
    try {
        for (var _b = __values(target.types), _c = _b.next(); !_c.done; _c = _b.next()) {
            var constituent = _c.value;
            var macro = getUserMacroOfType(state, node, constituent);
            if (macro) {
                return macro;
            }
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_6) throw e_6.error; }
    }
}
function isObjectType(type) {
    return type.isIntersection() ? type.types.every(isObjectType) : (type.flags & typescript_1.default.TypeFlags.Object) !== 0;
}
function getParameterCount(state, signature) {
    var length = signature.parameters.length;
    if (typescript_1.default.signatureHasRestParameter(signature)) {
        var restType = state.typeChecker.getTypeOfSymbol(signature.parameters[length - 1]);
        if ((0, isTupleType_1.isTupleType)(state, restType)) {
            return length + restType.target.fixedLength - (restType.target.hasRestElement ? 0 : 1);
        }
    }
    return length;
}
