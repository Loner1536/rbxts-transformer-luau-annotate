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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComponentConfig = updateComponentConfig;
var buildGuardFromType_1 = require("../../util/functions/buildGuardFromType");
var factory_1 = require("../../util/factory");
var getSuperClasses_1 = require("../../util/functions/getSuperClasses");
var nodeMetadata_1 = require("../../classes/nodeMetadata");
var diagnosticsUtils_1 = require("../../util/diagnosticsUtils");
function calculateOmittedGuards(state, classDeclaration, customAttributes) {
    var e_1, _a, e_2, _b;
    var omittedNames = new Set();
    if (factory_1.f.is.propertyAssignmentDeclaration(customAttributes) && factory_1.f.is.object(customAttributes.initializer)) {
        try {
            for (var _c = __values(customAttributes.initializer.properties), _d = _c.next(); !_d.done; _d = _c.next()) {
                var prop = _d.value;
                if (factory_1.f.is.string(prop.name) || factory_1.f.is.identifier(prop.name)) {
                    omittedNames.add(prop.name.text);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    var type = state.typeChecker.getTypeAtLocation(classDeclaration);
    var property = type.getProperty("attributes");
    if (!property)
        return omittedNames;
    var superClass = (0, getSuperClasses_1.getSuperClasses)(state.typeChecker, classDeclaration)[0];
    if (!superClass)
        return omittedNames;
    var superType = state.typeChecker.getTypeAtLocation(superClass);
    var superProperty = superType.getProperty("attributes");
    if (!superProperty)
        return omittedNames;
    var attributes = state.typeChecker.getTypeOfSymbolAtLocation(property, classDeclaration);
    var superAttributes = state.typeChecker.getTypeOfSymbolAtLocation(superProperty, superClass);
    try {
        for (var _e = __values(superAttributes.getProperties()), _f = _e.next(); !_f.done; _f = _e.next()) {
            var name_1 = _f.value.name;
            var prop = state.typeChecker.getTypeOfPropertyOfType(attributes, name_1);
            var superProp = state.typeChecker.getTypeOfPropertyOfType(superAttributes, name_1);
            if (prop && superProp && superProp === prop) {
                omittedNames.add(name_1);
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return omittedNames;
}
function updateAttributeGuards(state, node, properties) {
    var _a;
    var type = state.typeChecker.getTypeAtLocation(node);
    var property = type.getProperty("attributes");
    if (!property)
        return;
    var attributesMeta = nodeMetadata_1.NodeMetadata.fromSymbol(state, property);
    if (!attributesMeta || !attributesMeta.isRequested("intrinsic-component-attributes"))
        return;
    var attributesType = state.typeChecker.getTypeOfSymbolAtLocation(property, node);
    if (!attributesType)
        return;
    var attributes = properties.find(function (x) { return x.name && "text" in x.name && x.name.text === "attributes"; });
    var attributeGuards = (0, diagnosticsUtils_1.withDiagnosticContext)((_a = node.name) !== null && _a !== void 0 ? _a : node, function () { return "Failed to generate component attributes: ".concat(state.typeChecker.typeToString(attributesType)); }, function () { var _a; return (0, buildGuardFromType_1.buildGuardsFromType)(state, (_a = node.name) !== null && _a !== void 0 ? _a : node, attributesType); });
    var omittedGuards = calculateOmittedGuards(state, node, attributes);
    var filteredGuards = attributeGuards.filter(function (x) { return !omittedGuards.has(x.name.text); });
    properties = properties.filter(function (x) { return x !== attributes; });
    if (factory_1.f.is.propertyAssignmentDeclaration(attributes) && factory_1.f.is.object(attributes.initializer)) {
        properties.push(factory_1.f.update.propertyAssignmentDeclaration(attributes, factory_1.f.update.object(attributes.initializer, __spreadArray(__spreadArray([], __read(attributes.initializer.properties.map(function (v) { return state.transformNode(v); })), false), __read(filteredGuards), false)), attributes.name));
    }
    else {
        properties.push(factory_1.f.propertyAssignmentDeclaration("attributes", factory_1.f.object(filteredGuards)));
    }
    return properties;
}
function updateInstanceGuard(state, node, properties) {
    var type = state.typeChecker.getTypeAtLocation(node);
    var property = type.getProperty("instance");
    if (!property)
        return;
    var attributesMeta = nodeMetadata_1.NodeMetadata.fromSymbol(state, property);
    if (!attributesMeta || !attributesMeta.isRequested("intrinsic-component-instance"))
        return;
    var superClass = (0, getSuperClasses_1.getSuperClasses)(state.typeChecker, node)[0];
    if (!superClass)
        return;
    var customGuard = properties.find(function (x) { return x.name && "text" in x.name && x.name.text === "instanceGuard"; });
    if (customGuard)
        return;
    var instanceType = state.typeChecker.getTypeOfSymbolAtLocation(property, node);
    if (!instanceType)
        return;
    var superType = state.typeChecker.getTypeAtLocation(superClass);
    var superProperty = superType.getProperty("instance");
    if (!superProperty)
        return;
    var superInstanceType = state.typeChecker.getTypeOfSymbolAtLocation(superProperty, superClass);
    if (!superInstanceType)
        return;
    if (!type.checker.isTypeAssignableTo(superInstanceType, instanceType)) {
        var guard = (0, buildGuardFromType_1.buildGuardFromType)(state, node, instanceType);
        properties.push(factory_1.f.propertyAssignmentDeclaration("instanceGuard", guard));
    }
    return properties;
}
function updateComponentConfig(state, node, properties) {
    var _a, _b;
    properties = (_a = updateAttributeGuards(state, node, properties)) !== null && _a !== void 0 ? _a : properties;
    properties = (_b = updateInstanceGuard(state, node, properties)) !== null && _b !== void 0 ? _b : properties;
    return properties;
}
