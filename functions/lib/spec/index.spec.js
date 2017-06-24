"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var chai_1 = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var nock = require("nock");
nock.disableNetConnect();
// Use a fake database.
var fakedb = require("./fake-db");
fakedb.init('../src/db');
// Use a fake Speech API.
var fakespeech = require("./fake-speech");
fakespeech.init();
// Use a fake Translate API.
var faketranslate = require("./fake-translate");
faketranslate.init();
// Use a fake Firebase configuration.
var fakeconfig = require("./fake-config");
fakeconfig.init();
// Use a fake Firebase Admin.
var fakeadmin = require("./fake-admin");
fakeadmin.init();
// Ready to go!
var saythat = require("../src/saythat");
// Some test input data that we'll use in multiple tests.
var url = 'myurl://test';
var userId = '30hLypzZHnPHWrhw0pLx494fFsI2';
var lang = 'nl-NL';
var timestamp = '1494364778488';
var filename = "speech/" + userId + "." + lang + "." + timestamp + ".raw";
var scene = 'myCoolFancyScene';
describe('saythat', function () {
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    faketranslate.reset();
                    fakedb.reset();
                    return [4 /*yield*/, fakedb.set('/admin/current_scene', scene)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fakedb.set("/users/" + userId + "/lang/code", lang)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('setDefaults', function () {
        it('should set the default language', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, saythat.setDefaults(userId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/users/" + userId)).to.eventually.deep.equal({
                                lang: {
                                    name: 'English',
                                    code: 'en-US'
                                },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('analyzeSpeech', function () {
        it('should parse the components of a speech filename correctly', function () { return __awaiter(_this, void 0, void 0, function () {
            var noun;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        noun = 'appeltaart';
                        fakespeech.setResponse([noun]);
                        fakedb.set("/users/" + userId + "/scenes/" + scene + "/in_progress/" + timestamp, '...');
                        return [4 /*yield*/, saythat.analyzeSpeech(url, filename)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakespeech.getLastUrl()).to.equal(url)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakespeech.getLastRequest().languageCode).to.equal(lang)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakespeech.getLastRequest().encoding).to.equal('LINEAR16')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/users/" + userId + "/scenes/" + scene + "/nouns/" + noun)).to.eventually.equal('maybe...')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.has("/users/" + userId + "/scenes/" + scene + "/in_progress/" + timestamp)).to.equal(false)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should parse multiple words into multiple guesses', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakespeech.setResponse(['veel kleine appeltaartjes']);
                        return [4 /*yield*/, saythat.analyzeSpeech(url, filename)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/users/" + userId + "/scenes/" + scene + "/nouns/veel")).to.eventually.equal('maybe...')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/users/" + userId + "/scenes/" + scene + "/nouns/kleine")).to.eventually.equal('maybe...')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/users/" + userId + "/scenes/" + scene + "/nouns/appeltaartjes")).to.eventually.equal('maybe...')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should ignore secondary transcriptions returned by the speech API', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakespeech.setResponse(['meer', 'kleine', 'appeltaartjes']);
                        return [4 /*yield*/, saythat.analyzeSpeech(url, filename)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/users/" + userId + "/scenes/" + scene + "/nouns/meer")).to.eventually.equal('maybe...')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.has("/users/" + userId + "/scenes/" + scene + "/nouns/kleine")).to.equal(false)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.has("/users/" + userId + "/scenes/" + scene + "/nouns/appeltaartjes")).to.equal(false)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should always output lower-case resuls', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakespeech.setResponse(['Cantaloupe']);
                        return [4 /*yield*/, saythat.analyzeSpeech(url, filename)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/users/" + userId + "/scenes/" + scene + "/nouns/cantaloupe")).to.eventually.equal('maybe...')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('judgeGuessedNoun', function () {
        var langs = {
            langs: {
                'nl-NL': 1,
                'de-DE': 1,
            },
            num_langs: 2,
            score: 2,
        };
        var noun = 'taart';
        var english = 'pie';
        function insertCorrectNoun() {
            fakedb.set("/admin/scenes/" + scene + "/nouns/" + lang + "/" + noun, english);
            var langObj = {};
            langObj[noun] = english;
            fakedb.set("/admin/scenes/" + scene + "/nouns/" + lang, langObj);
        }
        it('should accurately determine incorrectness', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fakedb.set("/users/" + userId + "/scenes/" + scene + "/score", 0)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fakedb.set("/summary/" + scene + "/" + noun, langs)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, saythat.judgeGuessedNoun(userId, scene, noun, false)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/users/" + userId + "/scenes/" + scene + "/nouns/" + noun)).to.eventually.equal('false')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/users/" + userId + "/scenes/" + scene + "/score")).to.eventually.equal(0)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/all_guesses/" + scene + "/pushprefix-0")).to.eventually.deep.equal({
                                original: noun,
                                correctness: "false",
                                lang: lang,
                                translated: null,
                            })];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/summary/" + scene + "/" + noun)).to.eventually.deep.equal(langs)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should accurately determine correctness', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        insertCorrectNoun();
                        fakedb.set("/users/" + userId + "/scenes/" + scene + "/score", 0);
                        return [4 /*yield*/, fakedb.set("/summary/" + scene + "/" + english, langs)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, saythat.judgeGuessedNoun(userId, scene, noun, false)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/users/" + userId + "/scenes/" + scene + "/nouns/" + noun)).to.eventually.equal('true')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/users/" + userId + "/scenes/" + scene + "/score")).to.eventually.equal(1)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/all_guesses/" + scene + "/pushprefix-0")).to.eventually.deep.equal({
                                original: noun,
                                correctness: "true",
                                lang: lang,
                                translated: english,
                            })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/summary/" + scene + "/" + english)).to.eventually.deep.equal({
                                langs: {
                                    'nl-NL': 2,
                                    'de-DE': 1,
                                },
                                num_langs: 2,
                                score: 3,
                            })];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should initialize the score if there wasn\'t one yet', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        insertCorrectNoun();
                        return [4 /*yield*/, saythat.judgeGuessedNoun(userId, scene, noun, false)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/users/" + userId + "/scenes/" + scene + "/score")).to.eventually.equal(1)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/summary/" + scene + "/" + english)).to.eventually.deep.equal({
                                langs: {
                                    'nl-NL': 1,
                                },
                                num_langs: 1,
                                score: 1,
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not override existing language counters when adding a new one', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        insertCorrectNoun();
                        return [4 /*yield*/, fakedb.set("/summary/" + scene + "/" + english, {
                                langs: {
                                    'de-DE': 1,
                                },
                                num_langs: 1,
                                score: 1,
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, saythat.judgeGuessedNoun(userId, scene, noun, false)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/users/" + userId + "/scenes/" + scene + "/score")).to.eventually.equal(1)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/summary/" + scene + "/" + english)).to.eventually.deep.equal({
                                langs: {
                                    'de-DE': 1,
                                    'nl-NL': 1,
                                },
                                num_langs: 2,
                                score: 2,
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should filter out duplicate guesses from the same user', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        insertCorrectNoun();
                        fakedb.set("/users/" + userId + "/scenes/" + scene + "/score", 1);
                        return [4 /*yield*/, saythat.judgeGuessedNoun(userId, scene, noun, true /* guessed_before */)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/users/" + userId + "/scenes/" + scene + "/nouns/" + noun)).to.eventually.equal('true')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/users/" + userId + "/scenes/" + scene + "/score")).to.eventually.equal(1)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('updateCollectiveScores', function () {
        it('should create non-existing collective scores', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, saythat.updateCollectiveScores(userId, scene, 1)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/total_scores/" + scene)).to.eventually.equal(1)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/total_langs/" + scene)).to.eventually.deep.equal({
                                'nl-NL': 1,
                                'numLanguages': 1,
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should increment existing collective scores', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakedb.set("/total_scores/" + scene, 10);
                        fakedb.set("/total_langs/" + scene, {
                            'nl-NL': 5,
                            'de-DE': 5,
                            'numLanguages': 2,
                        });
                        return [4 /*yield*/, saythat.updateCollectiveScores(userId, scene, 1)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/total_scores/" + scene)).to.eventually.equal(11)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/total_langs/" + scene)).to.eventually.deep.equal({
                                'nl-NL': 6,
                                'de-DE': 5,
                                'numLanguages': 2,
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('nounAdded', function () {
        it('should translate a single noun to all languages', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        faketranslate.setResponse('nl', ['kaas']);
                        faketranslate.setResponse('fr', ['fromage']);
                        return [4 /*yield*/, saythat.nounAdded(scene, 'cheese')];
                    case 1:
                        _a.sent();
                        // 44 languages, but no translation is done for English.
                        return [4 /*yield*/, chai_1.expect(faketranslate.getNumTranslations()).to.equal(43)];
                    case 2:
                        // 44 languages, but no translation is done for English.
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/admin/scenes/" + scene + "/nouns/nl-NL/kaas")).to.eventually.equal('cheese')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/admin/scenes/" + scene + "/nouns/fr-FR/fromage")).to.eventually.equal('cheese')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("summary/" + scene + "/cheese")).to.eventually.deep.equal({
                                num_langs: 0,
                                score: 0
                            })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should be able to deal with various array-formatted replies', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        faketranslate.setResponse('nl', ['kaas', 'kaasje', 'Kelly']);
                        faketranslate.setResponse('fr', [['fromage', 'omelette']]);
                        return [4 /*yield*/, saythat.nounAdded(scene, 'cheese')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/admin/scenes/" + scene + "/nouns/nl-NL/kaas")).to.eventually.equal('cheese')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/admin/scenes/" + scene + "/nouns/fr-FR/fromage")).to.eventually.equal('cheese')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should lower-case nouns', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        faketranslate.setResponse('de', ['Morgen']);
                        return [4 /*yield*/, saythat.nounAdded(scene, 'morning')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, chai_1.expect(fakedb.get("/admin/scenes/" + scene + "/nouns/de-DE/morgen")).to.eventually.equal('morning')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
