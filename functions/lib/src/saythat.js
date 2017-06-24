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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _ = require("lodash");
var speechAPI = require("@google-cloud/speech");
var translateAPI = require("@google-cloud/translate");
var db = require("./db");
var ProfanityFilter = require("bad-words");
var speech = speechAPI();
var translate = translateAPI();
var profanityFilter = new ProfanityFilter({ replaceRegex: /[A-Za-z0-9가-힣_]/g });
function setDefaults(userId) {
    return db.set("/users/" + userId, {
        lang: {
            name: 'English',
            code: 'en-US'
        }
    });
}
exports.setDefaults = setDefaults;
var speechFilenameRegex = /(\w*).([a-zA-Z\-]*).(\d*).raw/;
function analyzeSpeech(url, filename) {
    return __awaiter(this, void 0, void 0, function () {
        var components, userId, languageCode, timestamp, request, results, transcription, scene, nouns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    components = filename.match(speechFilenameRegex);
                    if (components == null) {
                        console.error('Failed to parse filename ' + filename);
                        return [2 /*return*/];
                    }
                    userId = components[1];
                    languageCode = components[2];
                    timestamp = components[3];
                    request = {
                        encoding: 'LINEAR16',
                        languageCode: languageCode,
                        profanityFilter: true,
                    };
                    return [4 /*yield*/, speech.recognize(url, request)];
                case 1:
                    results = _a.sent();
                    transcription = results[0];
                    return [4 /*yield*/, db.get('/admin/current_scene')];
                case 2:
                    scene = _a.sent();
                    if (!(transcription == '')) return [3 /*break*/, 4];
                    console.log('Empty transcription, not written.');
                    return [4 /*yield*/, markProcessCompleted(userId, scene, timestamp)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
                case 4:
                    nouns = transcription.split(' ');
                    // Persist user guesses in the Firebase Realtime Database.
                    return [4 /*yield*/, writeNounsAsGuesses(nouns, userId, scene)];
                case 5:
                    // Persist user guesses in the Firebase Realtime Database.
                    _a.sent();
                    return [4 /*yield*/, markProcessCompleted(userId, scene, timestamp)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.analyzeSpeech = analyzeSpeech;
function writeNounsAsGuesses(nouns, userId, scene) {
    var operations = [];
    for (var index in nouns) {
        var noun = nouns[index].toLowerCase();
        operations.push(db.set("/users/" + userId + "/scenes/" + scene + "/nouns/" + noun, 'maybe...'));
    }
    return Promise.all(operations);
}
function markProcessCompleted(userId, scene, timestamp) {
    return db.remove("/users/" + userId + "/scenes/" + scene + "/in_progress/" + timestamp);
}
function judgeGuessedNoun(userId, scene, noun, guessed_before) {
    return __awaiter(this, void 0, void 0, function () {
        var lang, english, correct, score_diff;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    noun = profanityFilter.clean(noun).toLowerCase();
                    return [4 /*yield*/, getUserLanguage(userId)];
                case 1:
                    lang = _a.sent();
                    return [4 /*yield*/, getOriginalNoun(noun, scene, lang)];
                case 2:
                    english = _a.sent();
                    correct = english !== null ? 'true' : 'false';
                    score_diff = correct === 'true' && !guessed_before ? 1 : 0;
                    // Write the score to all parts of the Firebase Realtime Database that need to
                    // know.
                    return [2 /*return*/, Promise.all([
                            updateAllGuesses(scene, noun, correct, lang, english),
                            updateCorrectness(userId, scene, noun, correct),
                            updateScore(userId, scene, score_diff),
                            updateSummary(scene, english, lang, score_diff),
                        ])];
            }
        });
    });
}
exports.judgeGuessedNoun = judgeGuessedNoun;
function getUserLanguage(userId) {
    return db.get("/users/" + userId + "/lang/code");
}
// Returns null if the given noun was not found for the given scene and
// language.
function getOriginalNoun(noun, scene, lang) {
    return __awaiter(this, void 0, void 0, function () {
        var nouns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.get("/admin/scenes/" + scene + "/nouns/" + lang)];
                case 1:
                    nouns = _a.sent();
                    if (!_.has(nouns, noun)) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, nouns[noun]];
            }
        });
    });
}
function updateAllGuesses(scene, noun, correct, lang, english) {
    return db.push("/all_guesses/" + scene, {
        original: noun,
        correctness: correct,
        lang: lang,
        translated: english,
    });
}
function updateCorrectness(userId, scene, noun, correct) {
    return db.set("/users/" + userId + "/scenes/" + scene + "/nouns/" + noun, correct);
}
function updateScore(userId, scene, diff) {
    if (diff === 0)
        return;
    return db.transaction("/users/" + userId + "/scenes/" + scene + "/score", function (val) { return val ? val + diff : diff; });
}
function updateSummary(scene, english_noun, lang, score_diff) {
    if (score_diff <= 0)
        return;
    return db.transaction("/summary/" + scene + "/" + english_noun, function (val) {
        if (val === null) {
            val = {};
        }
        if (val.langs === undefined || val.langs === null || val.langs === 0) {
            val.langs = {};
        }
        if (!_.has(val.langs, lang)) {
            val.langs[lang] = score_diff;
        }
        else {
            val.langs[lang] += score_diff;
        }
        if (val.langs[lang] === 0) {
            delete val.langs[lang];
        }
        val.num_langs = _.size(val.langs);
        if (val.score === undefined || val.score === null) {
            val.score = 0;
        }
        val.score += score_diff;
        return val;
    });
}
function updateCollectiveScores(userId, scene, diff) {
    return __awaiter(this, void 0, void 0, function () {
        var userLang, operations;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getUserLanguage(userId)];
                case 1:
                    userLang = _a.sent();
                    operations = [];
                    operations.push(db.transaction("/total_scores/" + scene, function (val) { return val + diff; }));
                    operations.push(db.transaction("/total_langs/" + scene, function (val) {
                        if (val === null) {
                            val = {};
                        }
                        if (!_.has(val, 'numLanguages')) {
                            val['numLanguages'] = 0;
                        }
                        if (!_.has(val, userLang) || val[userLang] == 0) {
                            val['numLanguages'] += 1;
                            val[userLang] = 0;
                        }
                        val[userLang] += diff;
                        if (val[userLang] <= 0) {
                            val['numLanguages'] -= 1;
                            val[userLang] = 0;
                        }
                        return val;
                    }));
                    return [4 /*yield*/, Promise.all(operations)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateCollectiveScores = updateCollectiveScores;
// There are two standardized ways to represent language codes: a localized
// version, which distinguishes between accents and regions and such (BCP-47)
// and a generic just-the-language code (ISO-639-2). The Speech API uses BCP-47,
// the Translate API uses ISO-639 Alas, they don't match exactly, especially
// around the various Chinese languages, and so we must map them manually.
var bcp47iso639_1 = require("./bcp47iso639");
function nounAdded(scene, noun) {
    var operations = [];
    _.forEach(bcp47iso639_1.default, function (iso639code, bcp47code) {
        if (bcp47code == 'en-US') {
            // This is our source language.
            return;
        }
        var options = {
            from: 'en',
            to: iso639code,
        };
        operations.push(translate.translate(noun, options).then(function (results) {
            var translations = results[0];
            var translation = Array.isArray(translations) ? translations[0] : translations;
            translation = translation.toLowerCase(); // For cases like German, which capitalizes nouns.
            return db.set("/admin/scenes/" + scene + "/nouns/" + bcp47code + "/" + translation, noun);
        }));
        operations.push(db.set("summary/" + scene + "/" + noun, {
            num_langs: 0,
            score: 0
        }));
    });
    return Promise.all(operations);
}
exports.nounAdded = nounAdded;
