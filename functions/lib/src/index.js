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
var functions = require("firebase-functions");
var saythat = require("./saythat");
// When a user first registers, we want to set a few default values.
exports.setDefaults = functions.auth.user().onCreate(function (event) {
    return saythat.setDefaults(event.data.uid);
});
// When a user uploads a new audio file with the spoken guess for a noun, we
// analyze that audio file (using the Cloud Speech API) and write the
// transcription back into the Firebase Realtime Database as a guessed noun.
exports.analyzeSpeech = functions.storage.object().onChange(function (event) { return __awaiter(_this, void 0, void 0, function () {
    var url, filename;
    return __generator(this, function (_a) {
        if (event.data.resourceState != 'exists' || event.data.metageneration != 1) {
            // We're only interested in newly-created objects.
            return [2 /*return*/];
        }
        url = event.data.mediaLink;
        filename = event.data.name;
        try {
            return [2 /*return*/, saythat.analyzeSpeech(url, filename)];
        }
        catch (err) {
            console.error('Failed to analyze speech. Maybe a permissions issue on the GCS Bucket? ' + err);
        }
        return [2 /*return*/];
    });
}); });
// When a new guessed noun is written to the Firebase Realtime Database (either
// from the 'analyzeSpeech' function or directly by the user's app when) we'll
// do the actual scorekeeping in this function.
exports.judgeGuessedNoun = functions.database.ref('/users/{userId}/scenes/{scene}/nouns/{noun}').onWrite(function (event) { return __awaiter(_this, void 0, void 0, function () {
    var noun, guessed_before, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Only respond if the user just freshly guessed this noun.
                if (event.data.val() !== "maybe...") {
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                noun = event.params.noun;
                guessed_before = event.data.previous.exists();
                return [4 /*yield*/, saythat.judgeGuessedNoun(event.params.userId, event.params.scene, noun, guessed_before)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error('Error while judging our noun: ' + err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.updateCollectiveScores = functions.database.ref('/users/{userId}/scenes/{scene}/score').onWrite(function (event) { return __awaiter(_this, void 0, void 0, function () {
    var before, after, diff, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                before = event.data.previous.val() ? event.data.previous.val() : 0;
                after = event.data.current.val() ? event.data.current.val() : 0;
                diff = after - before;
                if (diff == 0)
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, saythat.updateCollectiveScores(event.params.userId, event.params.scene, diff)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.error('Error while updating collective scores: ' + err_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// When an administrator adds a new noun to the list of nouns, we should
// pre-compute what the translation of that noun is in all supported languages.
exports.nounAdded = functions.database.ref('/admin/scenes/{scene}/nouns/en-US/{noun}').onWrite(function (event) { return __awaiter(_this, void 0, void 0, function () {
    var err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Only respond if the entry was just added.
                if (!event.data.exists()) {
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, saythat.nounAdded(event.params.scene, event.params.noun)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.error('Translation error: ' + err_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
