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
exports.buildGuardsFromType = buildGuardsFromType;
exports.buildGuardFromType = buildGuardFromType;
exports.buildGuardFromTypeWithDedup = buildGuardFromTypeWithDedup;
exports.createGuardGenerator = createGuardGenerator;
var typescript_1 = __importDefault(require("typescript"));
var diagnostics_1 = require("../../classes/diagnostics");
var factory_1 = require("../factory");
var getDeclarationOfType_1 = require("./getDeclarationOfType");
var getInstanceTypeFromType_1 = require("./getInstanceTypeFromType");
var assert_1 = __importDefault(require("assert"));
/**
 * Convert a type into a list of typeguards.
 * @param state The TransformState
 * @param file The file that this type belongs to
 * @param type The type to convert
 * @param isInterfaceType Determines whether unknown should be omitted.
 * @returns An array of property assignments.
 */
function buildGuardsFromType(state, node, type, file, isInterfaceType) {
    if (file === void 0) { file = state.getSourceFile(node); }
    if (isInterfaceType === void 0) { isInterfaceType = false; }
    var generator = createGuardGenerator(state, file, node);
    return generator.buildGuardsFromType(type, isInterfaceType);
}
// This compiles directly to `t.typeof` for any userdata that `t` does not have an alias for, or users might not have yet.
var RBX_TYPES_NEW = ["buffer"];
var RBX_TYPES = __spreadArray([
    "UDim",
    "UDim2",
    "BrickColor",
    "Color3",
    "Vector2",
    "Vector3",
    "NumberSequence",
    "NumberSequenceKeypoint",
    "ColorSequence",
    "ColorSequenceKeypoint",
    "NumberRange",
    "Rect",
    "DockWidgetPluginGuiInfo",
    "CFrame",
    "Axes",
    "Faces",
    "Font",
    "Instance",
    "Ray",
    "Random",
    "Region3",
    "Region3int16",
    "Enum",
    "TweenInfo",
    "PhysicalProperties",
    "Vector3int16",
    "Vector2int16",
    "PathWaypoint",
    "EnumItem",
    "RBXScriptSignal",
    "RBXScriptConnection",
    "FloatCurveKey",
    "OverlapParams",
    "thread"
], __read(RBX_TYPES_NEW), false);
var OBJECT_IGNORED_FIELD_TYPES = typescript_1.default.TypeFlags.Unknown | typescript_1.default.TypeFlags.Never | typescript_1.default.TypeFlags.UniqueESSymbol;
var DEDUP_HEURISTIC_LIMIT = 5;
var DEDUP_HEURISTIC_FLAGS = typescript_1.default.TypeFlags.Object | typescript_1.default.TypeFlags.UnionOrIntersection;
function getTypesRequiringDedupHeuristic(type, dedupLimit) {
    var e_1, _a;
    if (dedupLimit === void 0) { dedupLimit = DEDUP_HEURISTIC_LIMIT; }
    var seenCount = new Map();
    function recurse(type, modifier) {
        var e_2, _a, e_3, _b;
        var _c;
        if (modifier === void 0) { modifier = 1; }
        if (type.flags & DEDUP_HEURISTIC_FLAGS) {
            var typeSeenCount = (_c = seenCount.get(type)) !== null && _c !== void 0 ? _c : 0;
            seenCount.set(type, typeSeenCount + modifier);
        }
        if (type.isUnionOrIntersection()) {
            type.types.forEach(function (ty) { return recurse(ty, modifier); });
        }
        else if (type.flags & typescript_1.default.TypeFlags.Object && !isInstanceType(type)) {
            try {
                for (var _d = __values(type.getProperties()), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var property = _e.value;
                    var propertyType = type.checker.getTypeOfPropertyOfType(type, property.name);
                    if (!propertyType) {
                        continue;
                    }
                    recurse(propertyType, modifier);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_2) throw e_2.error; }
            }
            try {
                for (var _f = __values(type.checker.getIndexInfosOfType(type)), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var indexInfo = _g.value;
                    recurse(indexInfo.keyType, modifier);
                    recurse(indexInfo.type, modifier);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
    }
    recurse(type);
    var requiresDedup = new Set();
    try {
        for (var seenCount_1 = __values(seenCount), seenCount_1_1 = seenCount_1.next(); !seenCount_1_1.done; seenCount_1_1 = seenCount_1.next()) {
            var _b = __read(seenCount_1_1.value, 2), type_1 = _b[0], count = _b[1];
            if (count >= dedupLimit) {
                requiresDedup.add(type_1);
                // We subtract all the children, as deduplicating the parent effectively removes `count - 1` of any children from the emit.
                recurse(type_1, -(count - 1));
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (seenCount_1_1 && !seenCount_1_1.done && (_a = seenCount_1.return)) _a.call(seenCount_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return requiresDedup;
}
/**
 * Convert a type into a type guard.
 * @param state The TransformState
 * @param file The file that this type belongs to
 * @param type The type to convert
 * @returns An array of property assignments.
 */
function buildGuardFromType(state, node, type, file) {
    if (file === void 0) { file = state.getSourceFile(node); }
    var generator = createGuardGenerator(state, file, node);
    return generator.buildGuard(type);
}
/**
 * Convert a type into a type guard, deduplicating large guards.
 * @param state The TransformState
 * @param file The file that this type belongs to
 * @param type The type to convert
 * @returns An array of property assignments.
 */
function buildGuardFromTypeWithDedup(state, node, type, file) {
    var _a;
    if (file === void 0) { file = state.getSourceFile(node); }
    var generator = createGuardGenerator(state, file, node);
    var dedupLimit = (_a = state.config.optimizations) === null || _a === void 0 ? void 0 : _a.guardGenerationDedupLimit;
    if (dedupLimit !== undefined) {
        generator.calculateDedup(type, Math.max(dedupLimit, 1));
    }
    return {
        guard: generator.buildGuard(type),
        statements: generator.dedupStatements,
    };
}
/**
 * Creates a stateful guard generator.
 */
function createGuardGenerator(state, file, diagnosticNode) {
    var tracking = new Array();
    var dedupStatements = new Array();
    var dedupIds = new Map();
    var requiresDedup = new Set();
    return { buildGuard: buildGuard, buildGuardsFromType: buildGuardsFromType, calculateDedup: calculateDedup, dedupStatements: dedupStatements };
    function fail(err) {
        var e_4, _a;
        var basicDiagnostic = diagnostics_1.Diagnostics.createDiagnostic(diagnosticNode, typescript_1.default.DiagnosticCategory.Error, err);
        var previousType;
        try {
            for (var tracking_1 = __values(tracking), tracking_1_1 = tracking_1.next(); !tracking_1_1.done; tracking_1_1 = tracking_1.next()) {
                var location_1 = tracking_1_1.value;
                if (location_1[1] === previousType) {
                    continue;
                }
                previousType = location_1[1];
                typescript_1.default.addRelatedInfo(basicDiagnostic, diagnostics_1.Diagnostics.createDiagnostic(factory_1.f.is.namedDeclaration(location_1[0]) ? location_1[0].name : location_1[0], typescript_1.default.DiagnosticCategory.Error, "Type was defined here: ".concat(state.typeChecker.typeToString(location_1[1]))));
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (tracking_1_1 && !tracking_1_1.done && (_a = tracking_1.return)) _a.call(tracking_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        throw new diagnostics_1.DiagnosticError(basicDiagnostic);
    }
    function calculateDedup(type, dedupLimit) {
        requiresDedup = getTypesRequiringDedupHeuristic(type, dedupLimit);
    }
    function buildGuard(type) {
        var _a, _b, _c;
        if (requiresDedup.has(type)) {
            var existingId = dedupIds.get(type);
            if (existingId) {
                return existingId;
            }
        }
        var declaration = (0, getDeclarationOfType_1.getDeclarationOfType)(type);
        if (declaration) {
            tracking.push([declaration, type]);
        }
        var guard = buildGuardInner(type);
        if (declaration) {
            (0, assert_1.default)(((_a = tracking.pop()) === null || _a === void 0 ? void 0 : _a[0]) === declaration, "Popped value was not expected");
        }
        if (requiresDedup.has(type)) {
            var dedupId = factory_1.f.identifier((_c = (_b = type.aliasSymbol) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : "dedup", true);
            dedupIds.set(type, dedupId);
            dedupStatements.push(factory_1.f.variableStatement(dedupId, guard));
            return dedupId;
        }
        return guard;
    }
    function buildGuardInner(type) {
        var e_5, _a, e_6, _b;
        var _c, _d, _e, _f, _g;
        var typeChecker = state.typeChecker;
        var tId = state.getGuardLibrary(file);
        if (type.isUnion()) {
            return buildUnionGuard(type);
        }
        if (isInstanceType(type)) {
            var instanceType = (0, getInstanceTypeFromType_1.getInstanceTypeFromType)(file, type);
            var additionalGuards = new Array();
            try {
                for (var _h = __values(type.getProperties()), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var property = _j.value;
                    var propertyType = type.checker.getTypeOfPropertyOfType(type, property.name);
                    if (propertyType && !instanceType.getProperty(property.name)) {
                        // assume intersections are children
                        additionalGuards.push(factory_1.f.propertyAssignmentDeclaration(property.name, buildGuard(propertyType)));
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_a = _h.return)) _a.call(_h);
                }
                finally { if (e_5) throw e_5.error; }
            }
            var baseGuard = factory_1.f.call(factory_1.f.field(tId, "instanceIsA"), [instanceType.symbol.name]);
            return additionalGuards.length === 0
                ? baseGuard
                : listLikeGuard("intersection", [
                    baseGuard,
                    factory_1.f.call(factory_1.f.field(tId, "children"), [factory_1.f.object(additionalGuards)]),
                ]);
        }
        if (type.isIntersection()) {
            return buildIntersectionGuard(type);
        }
        if (isConditionalType(type)) {
            return listLikeGuard("union", [buildGuard(type.resolvedTrueType), buildGuard(type.resolvedFalseType)]);
        }
        if ((type.flags & typescript_1.default.TypeFlags.TypeVariable) !== 0) {
            var constraint = type.checker.getBaseConstraintOfType(type);
            if (!constraint)
                fail("could not find constraint of type parameter");
            return buildGuard(constraint);
        }
        var literals = getLiteral(type);
        if (literals) {
            return listLikeGuard("literal", literals);
        }
        if (typeChecker.isTupleType(type)) {
            var typeArgs = (_c = type.resolvedTypeArguments) !== null && _c !== void 0 ? _c : [];
            return factory_1.f.call(factory_1.f.field(tId, "strictArray"), typeArgs.map(function (x) { return buildGuard(x); }));
        }
        if (typeChecker.isArrayType(type)) {
            var typeArg = (_d = type.typeArguments) === null || _d === void 0 ? void 0 : _d[0];
            return factory_1.f.call(factory_1.f.field(tId, "array"), [typeArg ? buildGuard(typeArg) : factory_1.f.field(tId, "any")]);
        }
        if (type.getCallSignatures().length > 0) {
            return factory_1.f.field(tId, "callback");
        }
        var voidType = typeChecker.getVoidType();
        var undefinedType = typeChecker.getUndefinedType();
        if (type === voidType || type === undefinedType) {
            return factory_1.f.field(tId, "none");
        }
        var anyType = typeChecker.getAnyType();
        if (type === anyType) {
            return factory_1.f.field(tId, "any");
        }
        var stringType = typeChecker.getStringType();
        if (type === stringType) {
            return factory_1.f.field(tId, "string");
        }
        var numberType = typeChecker.getNumberType();
        if (type === numberType) {
            return factory_1.f.field(tId, "number");
        }
        if ((type.flags & typescript_1.default.TypeFlags.Unknown) !== 0) {
            return listLikeGuard("union", [factory_1.f.field(tId, "any"), factory_1.f.field(tId, "none")]);
        }
        if (type.flags & typescript_1.default.TypeFlags.TemplateLiteral) {
            fail("Flamework encountered a template literal which is unsupported: ".concat(type.checker.typeToString(type)));
        }
        var symbol = type.getSymbol();
        if (!symbol) {
            fail("An unknown type was encountered with no symbol: ".concat(typeChecker.typeToString(type)));
        }
        var mapSymbol = typeChecker.resolveName("Map", undefined, typescript_1.default.SymbolFlags.Type, false);
        var readonlyMapSymbol = typeChecker.resolveName("ReadonlyMap", undefined, typescript_1.default.SymbolFlags.Type, false);
        var weakMapSymbol = typeChecker.resolveName("WeakMap", undefined, typescript_1.default.SymbolFlags.Type, false);
        if (symbol === mapSymbol || symbol === readonlyMapSymbol || symbol === weakMapSymbol) {
            var keyType = (_e = type.typeArguments) === null || _e === void 0 ? void 0 : _e[0];
            var valueType = (_f = type.typeArguments) === null || _f === void 0 ? void 0 : _f[1];
            return factory_1.f.call(factory_1.f.field(tId, "map"), [
                keyType ? buildGuard(keyType) : factory_1.f.field(tId, "any"),
                valueType ? buildGuard(valueType) : factory_1.f.field(tId, "any"),
            ]);
        }
        var setSymbol = typeChecker.resolveName("Set", undefined, typescript_1.default.SymbolFlags.Type, false);
        var readonlySetSymbol = typeChecker.resolveName("ReadonlySet", undefined, typescript_1.default.SymbolFlags.Type, false);
        if (symbol === setSymbol || symbol === readonlySetSymbol) {
            var valueType = (_g = type.typeArguments) === null || _g === void 0 ? void 0 : _g[0];
            return factory_1.f.call(factory_1.f.field(tId, "set"), [valueType ? buildGuard(valueType) : factory_1.f.field(tId, "any")]);
        }
        var promiseSymbol = typeChecker.resolveName("Promise", undefined, typescript_1.default.SymbolFlags.Type, false);
        if (symbol === promiseSymbol) {
            return factory_1.f.field("Promise", "is");
        }
        try {
            for (var RBX_TYPES_1 = __values(RBX_TYPES), RBX_TYPES_1_1 = RBX_TYPES_1.next(); !RBX_TYPES_1_1.done; RBX_TYPES_1_1 = RBX_TYPES_1.next()) {
                var guard = RBX_TYPES_1_1.value;
                var guardSymbol = typeChecker.resolveName(guard, undefined, typescript_1.default.SymbolFlags.Type, false);
                if (!guardSymbol && symbol.name === guard) {
                    fail("Could not find symbol for ".concat(guard));
                }
                if (symbol === guardSymbol) {
                    if (RBX_TYPES_NEW.includes(guard)) {
                        return factory_1.f.call(factory_1.f.field(tId, "typeof"), [guard]);
                    }
                    else {
                        return factory_1.f.field(tId, guard);
                    }
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (RBX_TYPES_1_1 && !RBX_TYPES_1_1.done && (_b = RBX_TYPES_1.return)) _b.call(RBX_TYPES_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        if (type.isClass()) {
            fail("Class \"".concat(type.symbol.name, "\" was encountered. Flamework does not support generating guards for classes."));
        }
        var isObject = isObjectType(type);
        var indexInfos = type.checker.getIndexInfosOfType(type);
        if (isObject && type.getApparentProperties().length === 0 && indexInfos.length === 0) {
            return factory_1.f.field(tId, "any");
        }
        if (isObject || type.isClassOrInterface()) {
            var guards = [];
            if (type.getApparentProperties().length > 0) {
                guards.push(factory_1.f.call(factory_1.f.field(tId, "interface"), [factory_1.f.object(buildGuardsFromType(type, true))]));
            }
            var indexInfo = indexInfos[0];
            if (indexInfo) {
                if (indexInfos.length > 1) {
                    fail("Flamework cannot generate types with multiple index signatures.");
                }
                guards.push(factory_1.f.call(factory_1.f.field(tId, "map"), [buildGuard(indexInfo.keyType), buildGuard(indexInfo.type)]));
            }
            return guards.length > 1 ? listLikeGuard("intersection", guards) : guards[0];
        }
        fail("An unknown type was encountered: ".concat(typeChecker.typeToString(type)));
    }
    function buildUnionGuard(type) {
        var tId = state.getGuardLibrary(file);
        var boolType = type.checker.getBooleanType();
        if (type === boolType) {
            return factory_1.f.field(tId, "boolean");
        }
        var _a = simplifyUnion(type), enums = _a.enums, literals = _a.literals, simplifiedTypes = _a.types;
        var _b = __read(extractTypes(type.checker, simplifiedTypes), 2), isOptional = _b[0], types = _b[1];
        var guards = types.map(function (type) { return buildGuard(type); });
        guards.push.apply(guards, __spreadArray([], __read(enums.map(function (enumId) { return factory_1.f.call(factory_1.f.field(tId, "enum"), [factory_1.f.field("Enum", enumId)]); })), false));
        if (literals.length > 0) {
            guards.push(listLikeGuard("literal", literals));
        }
        var union = guards.length > 1 ? listLikeGuard("union", guards) : guards[0];
        if (!union)
            return factory_1.f.field(tId, "none");
        return isOptional ? factory_1.f.call(factory_1.f.field(tId, "optional"), [union]) : union;
    }
    function buildIntersectionGuard(type) {
        if (type.checker.getIndexInfosOfType(type).length > 1) {
            fail("Flamework cannot generate intersections with multiple index signatures.");
        }
        // We find any disjoint types (strings, numbers, etc) as intersections with them are invalid.
        // Most intersections with disjoint types are used to introduce nominal fields.
        var disjointType = type.types.find(function (v) { return v.flags & typescript_1.default.TypeFlags.DisjointDomains; });
        if (disjointType) {
            return buildGuard(disjointType);
        }
        var guards = type.types.map(buildGuard);
        return listLikeGuard("intersection", guards);
    }
    function buildGuardsFromType(type, isInterfaceType) {
        var e_7, _a;
        var _b, _c;
        if (isInterfaceType === void 0) { isInterfaceType = false; }
        var typeChecker = state.typeChecker;
        var declaration = (0, getDeclarationOfType_1.getDeclarationOfType)(type);
        if (declaration) {
            tracking.push([declaration, type]);
        }
        var guards = new Array();
        try {
            for (var _d = __values(type.getProperties()), _e = _d.next(); !_e.done; _e = _d.next()) {
                var property = _e.value;
                var declaration_1 = property.valueDeclaration;
                var propertyType = typeChecker.getTypeOfPropertyOfType(type, property.name);
                if (!propertyType)
                    fail("Could not find type for field");
                if (isInterfaceType && (propertyType.flags & OBJECT_IGNORED_FIELD_TYPES) !== 0) {
                    continue;
                }
                if (declaration_1) {
                    tracking.push([declaration_1, propertyType]);
                }
                var attribute = buildGuard(propertyType);
                guards.push(factory_1.f.propertyAssignmentDeclaration(property.name, attribute));
                if (declaration_1) {
                    (0, assert_1.default)(((_b = tracking.pop()) === null || _b === void 0 ? void 0 : _b[0]) === declaration_1, "Popped value was not expected");
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_7) throw e_7.error; }
        }
        if (declaration) {
            (0, assert_1.default)(((_c = tracking.pop()) === null || _c === void 0 ? void 0 : _c[0]) === declaration, "Popped value was not expected");
        }
        return guards;
    }
    /**
     * This function creates a guard using either the vararg function or list (array) version.
     *
     * This is a relatively naive method of checking as it does not keep track of the real register count,
     * but fixing this fully would likely involve moving away from `t`.
     */
    function listLikeGuard(guard, list) {
        var tId = state.getGuardLibrary(file);
        if (list.length <= 2) {
            return factory_1.f.call(factory_1.f.field(tId, guard), list);
        }
        return factory_1.f.call(factory_1.f.field(tId, "".concat(guard, "List")), [list]);
    }
}
function simplifyUnion(type) {
    var e_8, _a, e_9, _b, e_10, _c;
    var _d, _e;
    var enumType = type.checker.resolveName("Enum", undefined, typescript_1.default.SymbolFlags.Type, false);
    if (type.aliasSymbol &&
        type.aliasSymbol.parent &&
        type.checker.getMergedSymbol(type.aliasSymbol.parent) === enumType) {
        return { enums: [type.aliasSymbol.name], types: [], literals: [] };
    }
    var currentTypes = type.types;
    var possibleEnums = new Map();
    var enums = new Array();
    var types = new Array();
    var literals = new Array();
    var isBoolean = currentTypes.filter(function (v) { return v.flags & typescript_1.default.TypeFlags.BooleanLiteral; }).length === 2;
    if (isBoolean) {
        types.push(type.checker.getBooleanType());
    }
    try {
        for (var currentTypes_1 = __values(currentTypes), currentTypes_1_1 = currentTypes_1.next(); !currentTypes_1_1.done; currentTypes_1_1 = currentTypes_1.next()) {
            var type_2 = currentTypes_1_1.value;
            // We do not need to generate symbol types as they don't exist in Lua.
            if (type_2.flags & typescript_1.default.TypeFlags.ESSymbolLike) {
                continue;
            }
            // This is a full `boolean`, so we can skip the individual literals.
            if (isBoolean && type_2.flags & typescript_1.default.TypeFlags.BooleanLiteral) {
                continue;
            }
            var literal = getLiteral(type_2, true);
            if (literal) {
                literals.push.apply(literals, __spreadArray([], __read(literal), false));
                continue;
            }
            if (!type_2.symbol || !type_2.symbol.parent) {
                types.push(type_2);
                continue;
            }
            var enumKind = type_2.symbol.parent;
            if (!enumKind || !enumKind.parent || type_2.checker.getMergedSymbol(enumKind.parent) !== enumType) {
                types.push(type_2);
                continue;
            }
            if (type_2.symbol === ((_d = enumKind.exports) === null || _d === void 0 ? void 0 : _d.get(type_2.symbol.escapedName))) {
                var enumValues = possibleEnums.get(enumKind);
                if (!enumValues)
                    possibleEnums.set(enumKind, (enumValues = new Set()));
                enumValues.add(type_2);
            }
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (currentTypes_1_1 && !currentTypes_1_1.done && (_a = currentTypes_1.return)) _a.call(currentTypes_1);
        }
        finally { if (e_8) throw e_8.error; }
    }
    try {
        for (var possibleEnums_1 = __values(possibleEnums), possibleEnums_1_1 = possibleEnums_1.next(); !possibleEnums_1_1.done; possibleEnums_1_1 = possibleEnums_1.next()) {
            var _f = __read(possibleEnums_1_1.value, 2), symbol = _f[0], set = _f[1];
            // Add 1 to account for GetEnumItems()
            if (set.size + 1 === ((_e = symbol.exports) === null || _e === void 0 ? void 0 : _e.size)) {
                enums.push(symbol.name);
            }
            else {
                try {
                    for (var set_1 = (e_10 = void 0, __values(set)), set_1_1 = set_1.next(); !set_1_1.done; set_1_1 = set_1.next()) {
                        var type_3 = set_1_1.value;
                        literals.push(factory_1.f.field(factory_1.f.field("Enum", symbol.name), type_3.symbol.name));
                    }
                }
                catch (e_10_1) { e_10 = { error: e_10_1 }; }
                finally {
                    try {
                        if (set_1_1 && !set_1_1.done && (_c = set_1.return)) _c.call(set_1);
                    }
                    finally { if (e_10) throw e_10.error; }
                }
            }
        }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (possibleEnums_1_1 && !possibleEnums_1_1.done && (_b = possibleEnums_1.return)) _b.call(possibleEnums_1);
        }
        finally { if (e_9) throw e_9.error; }
    }
    return { enums: enums, types: types, literals: literals };
}
function extractTypes(typeChecker, types) {
    var undefinedtype = typeChecker.getUndefinedType();
    var voidType = typeChecker.getVoidType();
    return [
        types.some(function (type) { return type === undefinedtype || type === voidType; }),
        types.filter(function (type) { return type !== undefinedtype && type !== voidType; }),
    ];
}
function getLiteral(type, withoutEnums) {
    var e_11, _a;
    var _b;
    if (withoutEnums === void 0) { withoutEnums = false; }
    if (type.isStringLiteral() || type.isNumberLiteral()) {
        return [typeof type.value === "string" ? factory_1.f.string(type.value) : factory_1.f.number(type.value)];
    }
    var trueType = type.checker.getTrueType();
    if (type === trueType) {
        return [factory_1.f.bool(true)];
    }
    var falseType = type.checker.getFalseType();
    if (type === falseType) {
        return [factory_1.f.bool(false)];
    }
    if (type.flags & typescript_1.default.TypeFlags.Enum) {
        var declarations = type.symbol.declarations;
        if (!declarations || declarations.length != 1 || !factory_1.f.is.enumDeclaration(declarations[0]))
            return;
        var declaration = declarations[0];
        var memberValues = new Array();
        try {
            for (var _c = __values(declaration.members), _d = _c.next(); !_d.done; _d = _c.next()) {
                var member = _d.value;
                var constant = type.checker.getConstantValue(member);
                if (constant === undefined)
                    return;
                memberValues.push(typeof constant === "string" ? factory_1.f.string(constant) : factory_1.f.number(constant));
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_11) throw e_11.error; }
        }
        return memberValues;
    }
    if (!withoutEnums) {
        var symbol = type.getSymbol();
        if (!symbol)
            return;
        var enumType = type.checker.resolveName("Enum", undefined, typescript_1.default.SymbolFlags.Type, false);
        if (((_b = symbol.parent) === null || _b === void 0 ? void 0 : _b.parent) && type.checker.getMergedSymbol(symbol.parent.parent) === enumType) {
            return [factory_1.f.field(factory_1.f.field("Enum", symbol.parent.name), symbol.name)];
        }
    }
}
function isObjectType(type) {
    return (type.flags & typescript_1.default.TypeFlags.Object) !== 0;
}
function isInstanceType(type) {
    return type.getProperty("_nominal_Instance") !== undefined;
}
function isConditionalType(type) {
    return (type.flags & typescript_1.default.TypeFlags.Conditional) !== 0;
}
