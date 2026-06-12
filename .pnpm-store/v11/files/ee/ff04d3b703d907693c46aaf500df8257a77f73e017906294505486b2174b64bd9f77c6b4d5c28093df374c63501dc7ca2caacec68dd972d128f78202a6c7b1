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
exports.transformClassDeclaration = transformClassDeclaration;
var assert_1 = __importDefault(require("assert"));
var typescript_1 = __importDefault(require("typescript"));
var diagnostics_1 = require("../../classes/diagnostics");
var nodeMetadata_1 = require("../../classes/nodeMetadata");
var factory_1 = require("../../util/factory");
var buildGuardFromType_1 = require("../../util/functions/buildGuardFromType");
var uid_1 = require("../../util/uid");
var updateComponentConfig_1 = require("../macros/updateComponentConfig");
function transformClassDeclaration(state, node) {
    var e_1, _a;
    var _b;
    var symbol = state.getSymbol(node);
    if (!symbol || !node.name)
        return state.transform(node);
    var classInfo = state.classes.get(symbol);
    if (!classInfo)
        return state.transform(node);
    var importIdentifier = state.addFileImport(state.getSourceFile(node), "@flamework/core", "Reflect");
    var reflectStatements = new Array();
    var decoratorStatements = new Array();
    var metadata = new nodeMetadata_1.NodeMetadata(state, node);
    reflectStatements.push.apply(reflectStatements, __spreadArray([], __read(convertReflectionToStatements(generateClassMetadata(state, classInfo, metadata, node))), false));
    decoratorStatements.push.apply(decoratorStatements, __spreadArray([], __read(getDecoratorStatements(state, node, node, metadata)), false));
    try {
        for (var _c = __values(node.members), _d = _c.next(); !_d.done; _d = _c.next()) {
            var member = _d.value;
            if (!member.name) {
                continue;
            }
            var propertyName = typescript_1.default.getPropertyNameForPropertyNameNode(member.name);
            if (!propertyName) {
                continue;
            }
            reflectStatements.push.apply(reflectStatements, __spreadArray([], __read(convertReflectionToStatements((_b = getNodeReflection(state, member)) !== null && _b !== void 0 ? _b : [], propertyName)), false));
            decoratorStatements.push.apply(decoratorStatements, __spreadArray([], __read(getDecoratorStatements(state, node, member)), false));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return __spreadArray([updateClass(state, node, reflectStatements)], __read(decoratorStatements), false);
    function convertReflectionToStatements(metadata, property) {
        var statements = metadata.map(function (_a) {
            var _b = __read(_a, 2), name = _b[0], value = _b[1];
            var args = [node.name, name, value];
            if (property !== undefined) {
                args.push(property);
            }
            return factory_1.f.statement(factory_1.f.call(factory_1.f.field(importIdentifier, "defineMetadata"), args));
        });
        addSectionComment(statements[0], node, property, "metadata");
        return statements;
    }
}
function generateFieldMetadata(state, metadata, field) {
    var _a, _b;
    var fields = new Array();
    var type = state.typeChecker.getTypeAtLocation(field);
    if (metadata.isRequested("flamework:type")) {
        if (!field.type) {
            var id = (0, uid_1.getTypeUid)(state, type, (_a = field.name) !== null && _a !== void 0 ? _a : field);
            fields.push(["flamework:type", id]);
        }
        else {
            var id = (0, uid_1.getNodeUid)(state, field.type);
            fields.push(["flamework:type", id]);
        }
    }
    if (metadata.isRequested("flamework:guard")) {
        var guard = (0, buildGuardFromType_1.buildGuardFromType)(state, (_b = field.type) !== null && _b !== void 0 ? _b : field, type);
        fields.push(["flamework:guard", guard]);
    }
    return fields;
}
function generateMethodMetadata(state, metadata, method) {
    var e_2, _a;
    var _b, _c;
    var fields = new Array();
    var baseSignature = state.typeChecker.getSignatureFromDeclaration(method);
    if (!baseSignature)
        return [];
    if (metadata.isRequested("flamework:return_type")) {
        if (!method.type) {
            var id = (0, uid_1.getTypeUid)(state, baseSignature.getReturnType(), (_b = method.name) !== null && _b !== void 0 ? _b : method);
            fields.push(["flamework:return_type", id]);
        }
        else {
            var id = (0, uid_1.getNodeUid)(state, method.type);
            fields.push(["flamework:return_type", id]);
        }
    }
    if (metadata.isRequested("flamework:return_guard")) {
        var guard = (0, buildGuardFromType_1.buildGuardFromType)(state, (_c = method.type) !== null && _c !== void 0 ? _c : method, baseSignature.getReturnType());
        fields.push(["flamework:return_guard", guard]);
    }
    var parameters = new Array();
    var parameterNames = new Array();
    var parameterGuards = new Array();
    try {
        for (var _d = __values(method.parameters), _e = _d.next(); !_e.done; _e = _d.next()) {
            var parameter = _e.value;
            if (metadata.isRequested("flamework:parameters")) {
                if (parameter.type) {
                    var id = (0, uid_1.getNodeUid)(state, parameter.type);
                    parameters.push(id);
                }
                else {
                    var type = state.typeChecker.getTypeAtLocation(parameter);
                    var id = (0, uid_1.getTypeUid)(state, type, parameter);
                    parameters.push(id);
                }
            }
            if (metadata.isRequested("flamework:parameter_names")) {
                if (factory_1.f.is.identifier(parameter.name)) {
                    parameterNames.push(parameter.name.text);
                }
                else {
                    parameterNames.push("_binding_");
                }
            }
            if (metadata.isRequested("flamework:parameter_guards")) {
                var type = state.typeChecker.getTypeAtLocation(parameter);
                var guard = (0, buildGuardFromType_1.buildGuardFromType)(state, parameter, type);
                parameterGuards.push(guard);
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
        }
        finally { if (e_2) throw e_2.error; }
    }
    if (parameters.length > 0) {
        fields.push(["flamework:parameters", parameters]);
    }
    if (parameterNames.length > 0) {
        fields.push(["flamework:parameter_names", parameterNames]);
    }
    if (parameterGuards.length > 0) {
        fields.push(["flamework:parameter_guards", parameterGuards]);
    }
    return fields;
}
function transformDecoratorConfig(state, declaration, symbol, expr) {
    if (!factory_1.f.is.call(expr)) {
        return [];
    }
    var metadata = nodeMetadata_1.NodeMetadata.fromSymbol(state, symbol);
    if (metadata && metadata.isRequested("intrinsic-component-decorator")) {
        (0, assert_1.default)(!expr.arguments[0] || factory_1.f.is.object(expr.arguments[0]));
        var baseConfig_1 = expr.arguments[0] ? expr.arguments[0] : factory_1.f.object([]);
        var componentConfig = (0, updateComponentConfig_1.updateComponentConfig)(state, declaration, __spreadArray([], __read(baseConfig_1.properties), false));
        return [
            factory_1.f.update.object(baseConfig_1, componentConfig.map(function (v) { return (baseConfig_1.properties.includes(v) ? state.transformNode(v) : v); })),
        ];
    }
    return expr.arguments.map(function (v) { return state.transformNode(v); });
}
function generateClassMetadata(state, classInfo, metadata, node) {
    var e_3, _a, e_4, _b;
    var fields = [];
    // Flamework decorators always generate the identifier field,
    // but the new decorator system does not require the identifier metadata to be specified.
    if (classInfo.containsLegacyDecorator || metadata.isRequested("identifier")) {
        fields.push(["identifier", (0, uid_1.getNodeUid)(state, node)]);
    }
    var constructor = node.members.find(function (x) { return factory_1.f.is.constructor(x); });
    if (constructor) {
        fields.push.apply(fields, __spreadArray([], __read(generateMethodMetadata(state, metadata, constructor)), false));
    }
    if (node.heritageClauses) {
        var implementClauses = new Array();
        try {
            for (var _c = __values(node.heritageClauses), _d = _c.next(); !_d.done; _d = _c.next()) {
                var clause = _d.value;
                if (clause.token !== typescript_1.default.SyntaxKind.ImplementsKeyword)
                    continue;
                try {
                    for (var _e = (e_4 = void 0, __values(clause.types)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var type = _f.value;
                        implementClauses.push(factory_1.f.string((0, uid_1.getNodeUid)(state, type)));
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
        if (implementClauses.length > 0 && metadata.isRequested("flamework:implements")) {
            fields.push(["flamework:implements", factory_1.f.array(implementClauses, false)]);
        }
    }
    return fields;
}
function getNodeReflection(state, node, metadata) {
    if (metadata === void 0) { metadata = new nodeMetadata_1.NodeMetadata(state, node); }
    if (factory_1.f.is.methodDeclaration(node)) {
        return generateMethodMetadata(state, metadata, node);
    }
    else if (factory_1.f.is.propertyDeclaration(node)) {
        return generateFieldMetadata(state, metadata, node);
    }
}
function getDecoratorStatements(state, declaration, node, metadata) {
    var e_5, _a;
    var _b;
    if (metadata === void 0) { metadata = new nodeMetadata_1.NodeMetadata(state, node); }
    if (!node.name) {
        return [];
    }
    var isClass = factory_1.f.is.classDeclaration(node);
    var symbol = state.getSymbol(node.name);
    var propertyName = typescript_1.default.getNameFromPropertyName(node.name);
    (0, assert_1.default)(propertyName);
    (0, assert_1.default)(symbol);
    var importIdentifier = state.addFileImport(state.getSourceFile(node), "@flamework/core", "Reflect");
    var decoratorStatements = new Array();
    var decorators = typescript_1.default.canHaveDecorators(node) ? typescript_1.default.getDecorators(node) : undefined;
    if (decorators) {
        // Decorators apply last->first, so we iterate the decorators in reverse.
        for (var i = decorators.length - 1; i >= 0; i--) {
            var decorator = decorators[i];
            var expr = decorator.expression;
            var type = state.typeChecker.getTypeAtLocation(expr);
            if (type.getProperty("_flamework_Decorator")) {
                var identifier = factory_1.f.is.call(expr) ? expr.expression : expr;
                var symbol_1 = state.getSymbol(identifier);
                (0, assert_1.default)(symbol_1);
                (0, assert_1.default)(symbol_1.valueDeclaration);
                var args = transformDecoratorConfig(state, declaration, symbol_1, expr);
                var propertyArgs = !factory_1.f.is.classDeclaration(node)
                    ? [propertyName, (node.modifierFlagsCache & typescript_1.default.ModifierFlags.Static) !== 0]
                    : [];
                decoratorStatements.push(factory_1.f.statement(factory_1.f.call(factory_1.f.field(importIdentifier, "decorate"), __spreadArray([
                    declaration.name,
                    (0, uid_1.getSymbolUid)(state, symbol_1, identifier),
                    identifier,
                    __spreadArray([], __read(args), false)
                ], __read(propertyArgs), false))));
            }
        }
    }
    var constraintTypes = metadata.getType("constraint");
    var nodeType = state.typeChecker.getTypeOfSymbolAtLocation(symbol, node);
    try {
        for (var _c = __values(constraintTypes !== null && constraintTypes !== void 0 ? constraintTypes : []), _d = _c.next(); !_d.done; _d = _c.next()) {
            var constraintType = _d.value;
            if (!state.typeChecker.isTypeAssignableTo(nodeType, constraintType)) {
                diagnostics_1.Diagnostics.addDiagnostic(getAssignabilityDiagnostics((_b = node.name) !== null && _b !== void 0 ? _b : node, nodeType, constraintType, metadata.getTrace(constraintType)));
            }
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_5) throw e_5.error; }
    }
    addSectionComment(decoratorStatements[0], declaration, isClass ? undefined : propertyName, "decorators");
    return decoratorStatements;
}
function addSectionComment(node, declaration, property, label) {
    if (!node) {
        return;
    }
    var elementName = property === undefined ? "".concat(declaration.name.text) : "".concat(declaration.name.text, ".").concat(property);
    typescript_1.default.addSyntheticLeadingComment(node, typescript_1.default.SyntaxKind.SingleLineCommentTrivia, " (Flamework) ".concat(elementName, " ").concat(label));
}
function formatType(type) {
    var typeNode = type.checker.typeToTypeNode(type, undefined, typescript_1.default.NodeBuilderFlags.InTypeAlias | typescript_1.default.NodeBuilderFlags.IgnoreErrors);
    var printer = typescript_1.default.createPrinter();
    return printer.printNode(typescript_1.default.EmitHint.Unspecified, typeNode, undefined);
}
function getAssignabilityDiagnostics(node, sourceType, constraintType, trace) {
    var diagnostic = diagnostics_1.Diagnostics.createDiagnostic(node, typescript_1.default.DiagnosticCategory.Error, "Type '".concat(formatType(sourceType), "' does not satify constraint '").concat(formatType(constraintType), "'"));
    if (trace) {
        typescript_1.default.addRelatedInfo(diagnostic, diagnostics_1.Diagnostics.createDiagnostic(trace, typescript_1.default.DiagnosticCategory.Message, "The constraint is defined here."));
    }
    return diagnostic;
}
function updateClass(state, node, staticStatements) {
    var modifiers = getAllModifiers(node);
    var members = node.members
        .map(function (node) { return state.transformNode(node); })
        .map(function (member) {
        // Strip Flamework decorators from members
        var modifiers = getAllModifiers(member);
        if (modifiers) {
            var filteredModifiers = transformModifiers(state, modifiers);
            if (factory_1.f.is.propertyDeclaration(member)) {
                return factory_1.f.update.propertyDeclaration(member, undefined, undefined, filteredModifiers);
            }
            else if (factory_1.f.is.methodDeclaration(member)) {
                return factory_1.f.update.methodDeclaration(member, undefined, undefined, undefined, undefined, filteredModifiers);
            }
        }
        return member;
    });
    if (staticStatements) {
        members.push(factory_1.f.staticBlockDeclaration(staticStatements));
    }
    return factory_1.f.update.classDeclaration(node, node.name ? state.transformNode(node.name) : undefined, members, node.heritageClauses, node.typeParameters, modifiers && transformModifiers(state, modifiers));
}
function getAllModifiers(node) {
    return typescript_1.default.canHaveDecorators(node) || typescript_1.default.canHaveModifiers(node) ? node.modifiers : undefined;
}
function transformModifiers(state, modifiers) {
    return modifiers
        .filter(function (modifier) {
        if (!typescript_1.default.isDecorator(modifier)) {
            return true;
        }
        var type = state.typeChecker.getTypeAtLocation(modifier.expression);
        return type.getProperty("_flamework_Decorator") === undefined;
    })
        .map(function (decorator) { return state.transform(decorator); });
}
