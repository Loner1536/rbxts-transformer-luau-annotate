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
exports.TransformState = void 0;
var typescript_1 = __importDefault(require("typescript"));
var fs_1 = __importDefault(require("fs"));
var crypto_1 = __importDefault(require("crypto"));
var path_1 = __importDefault(require("path"));
var hashids_1 = __importDefault(require("hashids"));
var transformNode_1 = require("../transformations/transformNode");
var cache_1 = require("../util/cache");
var getPackageJson_1 = require("../util/functions/getPackageJson");
var buildInfo_1 = require("./buildInfo");
var logger_1 = require("./logger");
var factory_1 = require("../util/factory");
var isPathDescendantOf_1 = require("../util/functions/isPathDescendantOf");
var isCleanBuildDirectory_1 = require("../util/functions/isCleanBuildDirectory");
var parseCommandLine_1 = require("../util/functions/parseCommandLine");
var createPathTranslator_1 = require("../util/functions/createPathTranslator");
var arePathsEqual_1 = require("../util/functions/arePathsEqual");
var nodeMetadata_1 = require("./nodeMetadata");
var rojo_resolver_1 = require("@roblox-ts/rojo-resolver");
var assert_1 = require("../util/functions/assert");
var schema_1 = require("../util/schema");
var shuffle_1 = require("../util/functions/shuffle");
var glob_1 = __importDefault(require("glob"));
var tryResolve_1 = require("../util/functions/tryResolve");
var diagnostics_1 = require("./diagnostics");
var IGNORE_RBXTS_REGEX = /node_modules\/@rbxts\/(compiler-types|types)\/.*\.d\.ts$/;
var TransformState = /** @class */ (function () {
    function TransformState(program, context, config) {
        var _a, _b, _c, _d, _e;
        this.program = program;
        this.context = context;
        this.config = config;
        this.parsedCommandLine = (0, parseCommandLine_1.parseCommandLine)();
        this.currentDirectory = this.parsedCommandLine.project;
        this.options = this.program.getCompilerOptions();
        this.srcDir = (_a = this.options.rootDir) !== null && _a !== void 0 ? _a : this.currentDirectory;
        this.outDir = (_b = this.options.outDir) !== null && _b !== void 0 ? _b : this.currentDirectory;
        this.rootDirs = this.options.rootDirs ? this.options.rootDirs : [this.srcDir];
        this.typeChecker = this.program.getTypeChecker();
        this.classes = new Map();
        this.isUserMacroCache = new Map();
        this.fileImports = new Map();
        this.prereqStack = new Array();
        var _f = (0, getPackageJson_1.getPackageJson)(this.currentDirectory), packageJson = _f.result, directory = _f.directory;
        this.rootDirectory = directory;
        (0, assert_1.assert)(packageJson.name);
        this.setupRojo();
        this.setupBuildInfo();
        (_c = config.idGenerationMode) !== null && _c !== void 0 ? _c : (config.idGenerationMode = config.obfuscation ? "obfuscated" : "full");
        this.packageName = packageJson.name;
        this.isGame = !this.packageName.startsWith("@");
        this.includeDirectory = this.getIncludePath();
        if (!this.isGame)
            (_d = config.hashPrefix) !== null && _d !== void 0 ? _d : (config.hashPrefix = this.packageName);
        this.buildInfo.setIdentifierPrefix(config.hashPrefix);
        if (((_e = config.hashPrefix) === null || _e === void 0 ? void 0 : _e.startsWith("$")) && !config.$rbxpackmode$) {
            throw new Error("The hashPrefix $ is used internally by Flamework");
        }
        cache_1.Cache.isInitialCompile = false;
    }
    TransformState.prototype.setupBuildInfo = function () {
        var e_1, _a, e_2, _b, e_3, _c;
        var _d;
        var baseBuildInfo = buildInfo_1.BuildInfo.fromDirectory(this.currentDirectory);
        if (!baseBuildInfo || (cache_1.Cache.isInitialCompile && (0, isCleanBuildDirectory_1.isCleanBuildDirectory)(this.options))) {
            if (this.options.incremental && this.options.tsBuildInfoFile) {
                if (typescript_1.default.sys.fileExists(this.options.tsBuildInfoFile)) {
                    throw new Error("Flamework cannot be built in a dirty environment, please delete your tsbuildinfo");
                }
            }
            baseBuildInfo = new buildInfo_1.BuildInfo(path_1.default.join(this.currentDirectory, "flamework.build"));
        }
        this.buildInfo = baseBuildInfo;
        this.buildInfo.setConfig(undefined);
        var configPath = path_1.default.join(this.rootDirectory, "flamework.json");
        if (fs_1.default.existsSync(configPath)) {
            var result = JSON.parse(fs_1.default.readFileSync(configPath, { encoding: "ascii" }));
            if ((0, schema_1.validateSchema)("config", result)) {
                this.buildInfo.setConfig(result);
            }
            else {
                logger_1.Logger.error("Malformed flamework.json");
                try {
                    for (var _e = __values((0, schema_1.getSchemaErrors)()), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var error = _f.value;
                        logger_1.Logger.error("".concat(error.keyword, " ").concat(error.instancePath, ": ").concat(error.message, " ").concat(JSON.stringify(error.params)));
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                process.exit(1);
            }
        }
        var candidates = (_d = cache_1.Cache.buildInfoCandidates) !== null && _d !== void 0 ? _d : [];
        if (!cache_1.Cache.buildInfoCandidates) {
            cache_1.Cache.buildInfoCandidates = candidates;
            var candidatesSet = new Set();
            try {
                for (var _g = __values(this.program.getSourceFiles()), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var file = _h.value;
                    var buildCandidate = buildInfo_1.BuildInfo.findCandidateUpper(path_1.default.dirname(file.fileName));
                    if (buildCandidate &&
                        !(0, arePathsEqual_1.arePathsEqual)(buildCandidate, baseBuildInfo.buildInfoPath) &&
                        !candidatesSet.has(buildCandidate)) {
                        candidatesSet.add(buildCandidate);
                        candidates.push(buildCandidate);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        try {
            for (var candidates_1 = __values(candidates), candidates_1_1 = candidates_1.next(); !candidates_1_1.done; candidates_1_1 = candidates_1.next()) {
                var candidate = candidates_1_1.value;
                var relativeCandidate = path_1.default.relative(this.currentDirectory, candidate);
                var buildInfo = buildInfo_1.BuildInfo.fromPath(candidate);
                if (buildInfo) {
                    logger_1.Logger.infoIfVerbose("Loaded buildInfo at ".concat(relativeCandidate, ", next id: ").concat(buildInfo.getLatestId()));
                    baseBuildInfo.addBuildInfo(buildInfo);
                }
                else {
                    logger_1.Logger.warn("Build info not valid at ".concat(relativeCandidate));
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (candidates_1_1 && !candidates_1_1.done && (_c = candidates_1.return)) _c.call(candidates_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    TransformState.prototype.setupRojo = function () {
        this.pathTranslator = (0, createPathTranslator_1.createPathTranslator)(this.program);
        var rojoArgvIndex = process.argv.findIndex(function (v) { return v === "--rojo"; });
        var rojoArg = rojoArgvIndex !== -1 ? process.argv[rojoArgvIndex + 1] : undefined;
        var rojoConfig;
        if (rojoArg && rojoArg !== "") {
            rojoConfig = path_1.default.resolve(rojoArg);
        }
        else {
            rojoConfig = rojo_resolver_1.RojoResolver.findRojoConfigFilePath(this.currentDirectory).path;
        }
        if (rojoConfig !== undefined) {
            var rojoContents = fs_1.default.readFileSync(rojoConfig, { encoding: "ascii" });
            var sum = crypto_1.default.createHash("md5").update(rojoContents).digest("hex");
            if (sum === cache_1.Cache.rojoSum) {
                this.rojoResolver = cache_1.Cache.rojoResolver;
            }
            else {
                this.rojoResolver = rojo_resolver_1.RojoResolver.fromPath(rojoConfig);
                cache_1.Cache.rojoSum = sum;
                cache_1.Cache.rojoResolver = this.rojoResolver;
            }
        }
    };
    TransformState.prototype.getIncludePath = function () {
        var includeArgvIndex = process.argv.findIndex(function (v) { return v === "--i" || v === "--includePath"; });
        var includePath = includeArgvIndex !== -1 ? process.argv[includeArgvIndex + 1] : undefined;
        return path_1.default.resolve(includePath || path_1.default.join(this.rootDirectory, "include"));
    };
    /**
     * Since npm modules can be symlinked, TypeScript can resolve them to their real path (outside of the project directory.)
     *
     * This function attempts to convert the real path of *npm modules* back to their path inside the project directory.
     * This is required to have RojoResolver be able to resolve files.
     */
    TransformState.prototype.toModulePath = function (filePath) {
        // The module is under our root directory, so it's probably not symlinked.
        if ((0, isPathDescendantOf_1.isPathDescendantOf)(filePath, this.rootDirectory)) {
            return filePath;
        }
        var packageJsonPath = typescript_1.default.findPackageJson(filePath, typescript_1.default.sys);
        if (!packageJsonPath) {
            throw new Error("Unable to convert '".concat(filePath, "' to module."));
        }
        var packageJson = JSON.parse(fs_1.default.readFileSync(packageJsonPath, { encoding: "utf8" }));
        return path_1.default.join(this.rootDirectory, "node_modules", packageJson.name, path_1.default.relative(path_1.default.dirname(packageJsonPath), filePath));
    };
    TransformState.prototype.calculateGlobs = function (globs) {
        var _this = this;
        if (!globs) {
            return;
        }
        for (var pathGlob in globs) {
            var paths = glob_1.default.sync(pathGlob, {
                root: this.rootDirectory,
                cwd: this.rootDirectory,
                nocase: true,
            });
            globs[pathGlob] = paths.map(function (globPath) {
                var outputPath = _this.pathTranslator.getOutputPath(globPath);
                return path_1.default.relative(_this.rootDirectory, outputPath).replace(/\\/g, "/");
            });
        }
    };
    TransformState.prototype.convertGlobs = function (globs, luaOut, pkg) {
        var e_4, _a;
        var _b;
        if (!globs) {
            return;
        }
        var pkgInfo = pkg ? this.buildInfo.getBuildInfoFromPrefix(pkg) : undefined;
        var root = pkgInfo ? path_1.default.dirname(this.toModulePath(pkgInfo.buildInfoPath)) : this.rootDirectory;
        for (var pathGlob in globs) {
            var paths = globs[pathGlob];
            var rbxPaths = new Array();
            try {
                for (var paths_1 = (e_4 = void 0, __values(paths)), paths_1_1 = paths_1.next(); !paths_1_1.done; paths_1_1 = paths_1.next()) {
                    var globPath = paths_1_1.value;
                    var rbxPath = (_b = this.rojoResolver) === null || _b === void 0 ? void 0 : _b.getRbxPathFromFilePath(path_1.default.join(root, globPath));
                    if (rbxPath) {
                        rbxPaths.push(rbxPath);
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (paths_1_1 && !paths_1_1.done && (_a = paths_1.return)) _a.call(paths_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
            luaOut.set(pkgInfo ? pathGlob : this.obfuscateText(pathGlob, "addPaths"), rbxPaths);
        }
    };
    TransformState.prototype.getFileId = function (file) {
        return path_1.default.relative(this.rootDirectory, file.fileName).replace(/\\/g, "/");
    };
    TransformState.prototype.saveArtifacts = function () {
        var e_5, _a, e_6, _b;
        var _c;
        var start = new Date().getTime();
        this.calculateGlobs((_c = this.buildInfo.getMetadata("globs")) === null || _c === void 0 ? void 0 : _c.paths);
        if (this.isGame) {
            var writtenFiles = new Map();
            var files = ["config.json", "globs.json"];
            var packageConfig = this.buildInfo.getChildrenMetadata("config");
            var config = this.buildInfo.getMetadata("config");
            if (config || packageConfig.size > 0) {
                writtenFiles.set("config.json", JSON.stringify({
                    game: config,
                    packages: Object.fromEntries(packageConfig),
                }));
            }
            var packageGlobs = this.buildInfo.getChildrenMetadata("globs");
            var globs = this.buildInfo.getMetadata("globs");
            if (globs || packageGlobs.size > 0) {
                var transformedGlobs = new Map();
                this.convertGlobs(globs === null || globs === void 0 ? void 0 : globs.paths, transformedGlobs);
                var transformedPackageGlobs = new Map();
                try {
                    for (var packageGlobs_1 = __values(packageGlobs), packageGlobs_1_1 = packageGlobs_1.next(); !packageGlobs_1_1.done; packageGlobs_1_1 = packageGlobs_1.next()) {
                        var _d = __read(packageGlobs_1_1.value, 2), pkg = _d[0], packageGlob = _d[1];
                        var transformedGlobs_1 = new Map();
                        this.convertGlobs(packageGlob === null || packageGlob === void 0 ? void 0 : packageGlob.paths, transformedGlobs_1, pkg);
                        transformedPackageGlobs.set(pkg, Object.fromEntries(transformedGlobs_1));
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (packageGlobs_1_1 && !packageGlobs_1_1.done && (_a = packageGlobs_1.return)) _a.call(packageGlobs_1);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                writtenFiles.set("globs.json", JSON.stringify({
                    game: Object.fromEntries(transformedGlobs),
                    packages: Object.fromEntries(transformedPackageGlobs),
                }));
            }
            var metadataPath = path_1.default.join(this.includeDirectory, "flamework");
            var metadataExists = fs_1.default.existsSync(metadataPath);
            if (!metadataExists && writtenFiles.size > 0) {
                fs_1.default.mkdirSync(metadataPath);
            }
            try {
                for (var files_1 = __values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
                    var file = files_1_1.value;
                    var filePath = path_1.default.join(metadataPath, file);
                    var contents = writtenFiles.get(file);
                    if (contents) {
                        fs_1.default.writeFileSync(filePath, contents);
                    }
                    else if (fs_1.default.existsSync(filePath)) {
                        fs_1.default.rmSync(filePath);
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (files_1_1 && !files_1_1.done && (_b = files_1.return)) _b.call(files_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
            if (metadataExists && writtenFiles.size === 0) {
                fs_1.default.rmdirSync(metadataPath);
            }
        }
        this.buildInfo.save();
        if (logger_1.Logger.verbose) {
            // Watch mode includes an extra newline when compilation finishes,
            // so we remove that newline before Flamework's message.
            var watch = process.argv.includes("-w") || process.argv.includes("--watch");
            if (watch) {
                process.stdout.write("\x1b[A\x1b[K");
            }
            logger_1.Logger.info("Flamework artifacts finished in ".concat(new Date().getTime() - start, "ms"));
            if (watch) {
                process.stdout.write("\n");
            }
        }
    };
    TransformState.prototype.isUserMacro = function (symbol) {
        var e_7, _a;
        var cached = this.isUserMacroCache.get(symbol);
        if (cached !== undefined)
            return cached;
        if (symbol.declarations) {
            try {
                for (var _b = __values(symbol.declarations), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var declaration = _c.value;
                    var metadata = new nodeMetadata_1.NodeMetadata(this, declaration);
                    if (metadata.isRequested("macro")) {
                        this.isUserMacroCache.set(symbol, true);
                        return true;
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }
        this.isUserMacroCache.set(symbol, false);
        return false;
    };
    TransformState.prototype.addFileImport = function (file, importPath, name) {
        var e_8, _a, e_9, _b;
        var _c;
        // Flamework itself uses features which require imports, this will rewrite those imports to be valid inside the Flamework package.
        if (importPath === "@flamework/core" && this.packageName === "@flamework/core" && this.config.$rbxpackmode$) {
            var fileName = path_1.default.basename(file.fileName);
            if (fileName === "flamework.ts" && name === "Flamework") {
                return factory_1.f.identifier("Flamework");
            }
            var modulePath = path_1.default.join(this.rootDirectory, "src", name === "Reflect" ? "reflect" : "flamework");
            importPath = "./" + path_1.default.relative(path_1.default.dirname(file.fileName), modulePath) || ".";
        }
        var importInfos = this.fileImports.get(file.fileName);
        if (!importInfos)
            this.fileImports.set(file.fileName, (importInfos = []));
        var importInfo = importInfos.find(function (x) { return x.path === importPath; });
        if (!importInfo)
            importInfos.push((importInfo = { path: importPath, entries: [] }));
        var identifier = (_c = importInfo.entries.find(function (x) { return x.name === name; })) === null || _c === void 0 ? void 0 : _c.identifier;
        if (!identifier) {
            try {
                start: for (var _d = __values(file.statements), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var statement = _e.value;
                    if (!factory_1.f.is.importDeclaration(statement))
                        break;
                    if (!factory_1.f.is.string(statement.moduleSpecifier))
                        continue;
                    if (!factory_1.f.is.importClauseDeclaration(statement.importClause))
                        continue;
                    if (!factory_1.f.is.namedImports(statement.importClause.namedBindings))
                        continue;
                    if (statement.importClause.isTypeOnly)
                        continue;
                    if (statement.moduleSpecifier.text !== importPath)
                        continue;
                    try {
                        for (var _f = (e_9 = void 0, __values(statement.importClause.namedBindings.elements)), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var importElement = _g.value;
                            if (importElement.isTypeOnly) {
                                continue;
                            }
                            if (importElement.propertyName) {
                                if (importElement.propertyName.text === name) {
                                    identifier = importElement.name;
                                    break start;
                                }
                            }
                            else {
                                if (importElement.name.text === name) {
                                    identifier = importElement.name;
                                    break start;
                                }
                            }
                        }
                    }
                    catch (e_9_1) { e_9 = { error: e_9_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                        }
                        finally { if (e_9) throw e_9.error; }
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_8) throw e_8.error; }
            }
        }
        if (!identifier) {
            importInfo.entries.push({ name: name, identifier: (identifier = factory_1.f.identifier(name, true)) });
        }
        return identifier;
    };
    TransformState.prototype.getSourceFile = function (node) {
        var parseNode = typescript_1.default.getParseTreeNode(node);
        if (!parseNode)
            throw new Error("Could not find parse tree node");
        return typescript_1.default.getSourceFileOfNode(parseNode);
    };
    TransformState.prototype.getSymbol = function (node, followAlias) {
        if (followAlias === void 0) { followAlias = true; }
        if (factory_1.f.is.namedDeclaration(node)) {
            return this.getSymbol(node.name);
        }
        var symbol = this.typeChecker.getSymbolAtLocation(node);
        if (symbol && followAlias) {
            return typescript_1.default.skipAlias(symbol, this.typeChecker);
        }
        else {
            return symbol;
        }
    };
    TransformState.prototype.hash = function (id, noPrefix) {
        var _a;
        var hashPrefix = this.config.hashPrefix;
        var salt = (_a = this.config.salt) !== null && _a !== void 0 ? _a : this.buildInfo.getSalt();
        var hashGenerator = new hashids_1.default(salt, 2);
        if ((this.isGame && !hashPrefix) || noPrefix) {
            return "".concat(hashGenerator.encode(id));
        }
        else {
            // If the package name is namespaced, then it can be used in
            // other projects so we want to add a prefix to the Id to prevent
            // collisions with other packages or the game.
            return "".concat(hashPrefix !== null && hashPrefix !== void 0 ? hashPrefix : this.packageName, ":").concat(hashGenerator.encode(id));
        }
    };
    TransformState.prototype.obfuscateText = function (text, context) {
        return this.config.obfuscation ? this.buildInfo.hashString(text, context) : text;
    };
    TransformState.prototype.obfuscateArray = function (array) {
        return this.config.obfuscation ? (0, shuffle_1.shuffle)(array) : array;
    };
    TransformState.prototype.addDiagnostic = function (diag) {
        this.context.addDiagnostic(diag);
    };
    TransformState.prototype.capture = function (cb) {
        this.prereqStack.push([]);
        var result = cb();
        return [result, this.prereqStack.pop()];
    };
    TransformState.prototype.prereq = function (statement) {
        var stack = this.prereqStack[this.prereqStack.length - 1];
        if (stack)
            stack.push(statement);
    };
    TransformState.prototype.prereqList = function (statements) {
        var stack = this.prereqStack[this.prereqStack.length - 1];
        if (stack)
            stack.push.apply(stack, __spreadArray([], __read(statements), false));
    };
    TransformState.prototype.isCapturing = function (threshold) {
        if (threshold === void 0) { threshold = 1; }
        return this.prereqStack.length > threshold;
    };
    TransformState.prototype.transform = function (node) {
        var _this = this;
        return typescript_1.default.visitEachChild(node, function (newNode) { return (0, transformNode_1.transformNode)(_this, newNode); }, this.context);
    };
    TransformState.prototype.transformNode = function (node) {
        var _this = this;
        // Technically this isn't guaranteed to return `T`, and TypeScript 5.0+ updated the signature to disallow this,
        // but we don't care so we'll just cast it.
        return typescript_1.default.visitNode(node, function (newNode) { return (0, transformNode_1.transformNode)(_this, newNode); });
    };
    TransformState.prototype._shouldViewFile = function (file) {
        var e_10, _a;
        var fileName = path_1.default.posix.normalize(file.fileName);
        if (IGNORE_RBXTS_REGEX.test(fileName))
            return false;
        var buildCandidates = cache_1.Cache.buildInfoCandidates;
        try {
            for (var buildCandidates_1 = __values(buildCandidates), buildCandidates_1_1 = buildCandidates_1.next(); !buildCandidates_1_1.done; buildCandidates_1_1 = buildCandidates_1.next()) {
                var candidate = buildCandidates_1_1.value;
                var realPath = cache_1.Cache.realPath.get(candidate);
                if (!realPath)
                    cache_1.Cache.realPath.set(candidate, (realPath = fs_1.default.realpathSync(candidate)));
                var candidateDir = path_1.default.dirname(realPath);
                if ((0, isPathDescendantOf_1.isPathDescendantOf)(file.fileName, candidateDir) &&
                    !(0, isPathDescendantOf_1.isPathDescendantOf)(file.fileName, path_1.default.join(candidateDir, "node_modules"))) {
                    return true;
                }
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (buildCandidates_1_1 && !buildCandidates_1_1.done && (_a = buildCandidates_1.return)) _a.call(buildCandidates_1);
            }
            finally { if (e_10) throw e_10.error; }
        }
        return false;
    };
    TransformState.prototype.shouldViewFile = function (file) {
        var _a;
        var cached = (_a = cache_1.Cache.shouldView) === null || _a === void 0 ? void 0 : _a.get(file.fileName);
        if (cached !== undefined)
            return cached;
        var result = this._shouldViewFile(file);
        cache_1.Cache.shouldView.set(file.fileName, result);
        return result;
    };
    TransformState.prototype.getGuardLibrary = function (file) {
        if (this.flameworkGuardLibraryPath) {
            return this.addFileImport(file, this.flameworkGuardLibraryPath, "t");
        }
        var corePath = (0, tryResolve_1.tryResolveTS)(this, "@flamework/core", file.fileName);
        if (corePath === undefined) {
            diagnostics_1.Diagnostics.warning(file.endOfFileToken, "Flamework core was not found, guard generation may not work.");
            return this.addFileImport(file, "@rbxts/t", "t");
        }
        var fileGuardPath = (0, tryResolve_1.tryResolveTS)(this, "@rbxts/t", path_1.default.dirname(file.fileName));
        var coreGuardPath = (0, tryResolve_1.tryResolveTS)(this, "@rbxts/t", corePath);
        if (fileGuardPath === coreGuardPath) {
            // @flamework/core and the consuming project are using the same @rbxts/t version.
            this.flameworkGuardLibraryPath = "@rbxts/t";
            return this.addFileImport(file, "@rbxts/t", "t");
        }
        if (coreGuardPath === undefined ||
            !(0, isPathDescendantOf_1.isPathDescendantOf)(coreGuardPath, path_1.default.join(path_1.default.dirname(corePath), "../node_modules/@rbxts/t"))) {
            diagnostics_1.Diagnostics.warning(file.endOfFileToken, "Valid `@rbxts/t` was not found, guard generation may not work.");
            return this.addFileImport(file, "@rbxts/t", "t");
        }
        this.flameworkGuardLibraryPath = "@flamework/core/out/prelude";
        return this.addFileImport(file, this.flameworkGuardLibraryPath, "t");
    };
    return TransformState;
}());
exports.TransformState = TransformState;
