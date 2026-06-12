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
exports.transformFile = transformFile;
var typescript_1 = __importDefault(require("typescript"));
var diagnostics_1 = require("../classes/diagnostics");
var factory_1 = require("../util/factory");
var transformStatementList_1 = require("./transformStatementList");
function transformFile(state, file) {
    var e_1, _a;
    state.buildInfo.invalidateGlobs(state.getFileId(file));
    var statements = (0, transformStatementList_1.transformStatementList)(state, file.statements);
    var imports = state.fileImports.get(file.fileName);
    if (imports) {
        var firstStatement = statements[0];
        statements.unshift.apply(statements, __spreadArray([], __read(imports.map(function (info) {
            return factory_1.f.importDeclaration(info.path, info.entries.map(function (x) { return [x.name, x.identifier]; }));
        })), false));
        // steal comments from original first statement so that comment directives work properly
        if (firstStatement && statements[0]) {
            var original = typescript_1.default.getParseTreeNode(firstStatement);
            typescript_1.default.moveSyntheticComments(statements[0], firstStatement);
            if (original) {
                typescript_1.default.copyComments(original, statements[0]);
                typescript_1.default.removeAllComments(original);
            }
        }
    }
    try {
        for (var _b = __values(diagnostics_1.Diagnostics.flush()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var diag = _c.value;
            state.addDiagnostic(diag);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var sourceFile = factory_1.f.update.sourceFile(file, statements);
    return sourceFile;
}
