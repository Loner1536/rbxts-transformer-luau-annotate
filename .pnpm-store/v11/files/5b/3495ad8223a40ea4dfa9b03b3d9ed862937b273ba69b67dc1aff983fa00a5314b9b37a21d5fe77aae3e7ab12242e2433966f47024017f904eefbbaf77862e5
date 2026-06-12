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
exports.viewClassDeclaration = viewClassDeclaration;
var typescript_1 = __importDefault(require("typescript"));
var path_1 = __importDefault(require("path"));
var factory_1 = require("../../util/factory");
var uid_1 = require("../../util/uid");
var nodeMetadata_1 = require("../../classes/nodeMetadata");
function viewClassDeclaration(state, node) {
    var e_1, _a;
    var _b;
    var symbol = state.getSymbol(node);
    var internalId = (0, uid_1.getNodeUid)(state, node);
    if (!node.name || !symbol)
        return;
    var nodeDecorators = typescript_1.default.canHaveDecorators(node) ? typescript_1.default.getDecorators(node) : undefined;
    var decorators = [];
    if (nodeDecorators) {
        try {
            for (var nodeDecorators_1 = __values(nodeDecorators), nodeDecorators_1_1 = nodeDecorators_1.next(); !nodeDecorators_1_1.done; nodeDecorators_1_1 = nodeDecorators_1.next()) {
                var decorator = nodeDecorators_1_1.value;
                if (!factory_1.f.is.call(decorator.expression))
                    continue;
                var symbol_1 = state.getSymbol(decorator.expression.expression);
                if (!symbol_1)
                    continue;
                if (!((_b = symbol_1.declarations) === null || _b === void 0 ? void 0 : _b[0]))
                    continue;
                if (!factory_1.f.is.identifier(decorator.expression.expression))
                    continue;
                var name_1 = decorator.expression.expression.text;
                decorators.push({
                    type: "WithNodes",
                    declaration: symbol_1.declarations[0],
                    arguments: decorator.expression.arguments.map(function (x) { return x; }),
                    internalId: (0, uid_1.getSymbolUid)(state, symbol_1, decorator.expression.expression),
                    name: name_1,
                    symbol: symbol_1,
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (nodeDecorators_1_1 && !nodeDecorators_1_1.done && (_a = nodeDecorators_1.return)) _a.call(nodeDecorators_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    var flameworkDecorators = hasFlameworkDecorators(state, node);
    var isFlameworkClass = flameworkDecorators || hasReflectMetadata(state, node);
    if (isFlameworkClass) {
        var classInfo = {
            name: node.name.text,
            containsLegacyDecorator: flameworkDecorators,
            internalId: internalId,
            node: node,
            decorators: decorators,
            symbol: symbol,
        };
        state.classes.set(symbol, classInfo);
        if (!state.isGame && !state.buildInfo.getBuildClass(internalId)) {
            var filePath = state.pathTranslator.getOutputPath(state.getSourceFile(node).fileName);
            var relativePath = path_1.default.relative(state.currentDirectory, filePath);
            state.buildInfo.addBuildClass({
                filePath: relativePath,
                internalId: internalId,
                decorators: decorators.map(function (x) { return ({
                    internalId: x.internalId,
                    name: x.name,
                }); }),
            });
        }
    }
    else {
        var buildClass = state.buildInfo.getBuildClass(internalId);
        if (buildClass) {
            state.classes.set(symbol, {
                internalId: internalId,
                node: node,
                symbol: symbol,
                name: node.name.text,
                decorators: buildClass.decorators.map(function (x) { return ({
                    type: "Base",
                    internalId: x.internalId,
                    name: x.name,
                }); }),
                containsLegacyDecorator: false,
            });
        }
    }
}
function hasReflectMetadata(state, declaration) {
    var metadata = new nodeMetadata_1.NodeMetadata(state, declaration);
    if (metadata.isRequested("reflect")) {
        return true;
    }
    return false;
}
function hasFlameworkDecorators(state, declaration) {
    var e_2, _a;
    var nodeDecorators = typescript_1.default.canHaveDecorators(declaration) ? typescript_1.default.getDecorators(declaration) : undefined;
    if (nodeDecorators && nodeDecorators.some(function (v) { return isFlameworkDecorator(state, v); })) {
        return true;
    }
    try {
        for (var _b = __values(declaration.members), _c = _b.next(); !_c.done; _c = _b.next()) {
            var member = _c.value;
            var nodeDecorators_2 = typescript_1.default.canHaveDecorators(member) ? typescript_1.default.getDecorators(member) : undefined;
            if (nodeDecorators_2 && nodeDecorators_2.some(function (v) { return isFlameworkDecorator(state, v); })) {
                return true;
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return false;
}
function isFlameworkDecorator(state, decorator) {
    var decoratorType = state.typeChecker.getTypeAtLocation(decorator.expression);
    if (decoratorType.getProperty("_flamework_Decorator")) {
        return true;
    }
}
