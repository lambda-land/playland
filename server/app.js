"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.__esModule = true;
var path = require("path");
var os = require("os");
var util_1 = require("util");
var child_process_1 = require("child_process");
var exec = (0, util_1.promisify)(child_process_1.exec);
var promises_1 = require("fs/promises");
var express = require("express");
var app = express();
var port = 9000 || process.env.PORT;
var elm_config = require('./elm-config.json');
app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // Pass to next layer of middleware
    next();
});
var run = function (_a, folder) {
    var source = _a.source, expression = _a.expression;
    return __awaiter(void 0, void 0, void 0, function () {
        var contents, elmProcess, output, instructions, done, code;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    contents = "module Program exposing (..)\n" + source + "\nexpr=" + expression + "\n";
                    return [4 /*yield*/, (0, promises_1.writeFile)(path.join(folder, 'Program.elm'), contents)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(path.join(folder, 'elm.json'), JSON.stringify(elm_config))];
                case 2:
                    _b.sent();
                    elmProcess = (0, child_process_1.spawn)('elm', ['repl', '--no-colors'], { cwd: folder, shell: true });
                    output = [];
                    instructions = __spreadArray(__spreadArray([], [
                        // ':reset',
                        '2 + 2',
                        'import Program exposing (..)',
                        // contents,
                        expression,
                    ].map(function (inst) { return inst + '\n'; }), true), [expression], false);
                    elmProcess.stderr.on('data', function (data) {
                        console.error(data.toString());
                    });
                    done = false;
                    return [4 /*yield*/, new Promise(function (res, rej) {
                            elmProcess.stdout.on('data', function (data) {
                                if (done) {
                                    res(0);
                                    return;
                                }
                                var dat = data.toString();
                                output.push(dat);
                                // console.log('Data Out: ', dat);
                                if (instructions.length > 0) {
                                    var next = instructions.shift();
                                    elmProcess.stdin.write(next);
                                }
                                else {
                                    elmProcess.stdin.end();
                                    elmProcess.kill();
                                    // console.warn('killed');
                                    done = true;
                                }
                            });
                        })];
                case 3:
                    code = _b.sent();
                    // const writes = instructions.map(inst => new Promise(
                    //     (res,rej) => elmProcess.stdin.write(inst + '\n', res)));
                    // for (const write of writes) {
                    //     await write;
                    // }
                    // const writes = instructions.map(inst => elmProcess.stdin.write(inst));
                    // for (const inst of instructions) {
                    //     await new Promise((res,rej) => {
                    //         elmProcess.stdin.write(inst + '\n', () => {
                    //             console.log('written', inst);
                    //             res(null);
                    //         });
                    //     });
                    // }
                    // elmProcess.stdin.end();
                    // elmProcess.kill();
                    // const exitCode = await new Promise((resolve,reject) => {
                    //     elmProcess.on('close', resolve);
                    //     elmProcess.kill('SIGINT');
                    // })
                    // await rmdir(folder, { recursive: true });
                    // })
                    // elmProcess.stdin.end();
                    // elmProcess.kill();
                    // console.log(output, 'exit code:', exitCode);
                    return [2 /*return*/, ("" + output[output.length - 1]).trim()];
            }
        });
    });
};
var resources = new Map();
app.post('/', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var pkg, ip, resourcePath, _a, output;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                pkg = request["body"];
                ip = request.ip;
                _a = resources.get(ip);
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, promises_1.mkdtemp)(path.join(os.tmpdir(), "elm-"))];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                resourcePath = _a;
                return [4 /*yield*/, run(pkg, resourcePath)];
            case 3:
                output = _b.sent();
                // await rmdir(resourcePath, { recursive: true })
                console.log('Output:', output);
                response.json({ evaluated: output });
                return [2 /*return*/];
        }
    });
}); });
function test() {
    return __awaiter(this, void 0, void 0, function () {
        var pkg, ip, resourcePath, _a, output;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = {
                        language: 'elm'
                    };
                    return [4 /*yield*/, (0, promises_1.readFile)('./TestSource.elm')];
                case 1:
                    pkg = (_b.source = (_c.sent()).toString(),
                        _b.expression = '1 + h',
                        _b);
                    ip = '6969696';
                    _a = resources.get(ip);
                    if (_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, promises_1.mkdtemp)(path.join(os.tmpdir(), "playland-" + ip + "-"))];
                case 2:
                    _a = (_c.sent());
                    _c.label = 3;
                case 3:
                    resourcePath = _a;
                    resources.set(ip, resourcePath);
                    return [4 /*yield*/, run(pkg, resourcePath)];
                case 4:
                    output = _c.sent();
                    console.log(output);
                    return [2 /*return*/];
            }
        });
    });
}
// test();
app.get('/', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        response.json({ message: 'Hello!' });
        return [2 /*return*/];
    });
}); });
app.listen(port, function () { return console.log('Listening on', port); });
