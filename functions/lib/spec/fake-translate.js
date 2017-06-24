"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mock = require("mock-require");
var defaultResponse;
var languageResponse;
var lastInput;
var lastOptions;
var numTranslations;
function reset() {
    defaultResponse = ['unset'];
    languageResponse = {};
    lastInput = '';
    lastOptions = {};
    numTranslations = 0;
}
exports.reset = reset;
// This is the actual method being faked.
exports.translate = {
    translate: function (input, options) {
        lastInput = input;
        lastOptions = options;
        numTranslations++;
        if (languageResponse.hasOwnProperty(options.to)) {
            return Promise.resolve(languageResponse[options.to]);
        }
        return Promise.resolve(defaultResponse);
    },
};
function setDefaultResponse(r) {
    defaultResponse = r;
}
exports.setDefaultResponse = setDefaultResponse;
function setResponse(lang, r) {
    languageResponse[lang] = r;
}
exports.setResponse = setResponse;
function getLastInput() {
    return lastInput;
}
exports.getLastInput = getLastInput;
function getLastOptions() {
    return lastOptions;
}
exports.getLastOptions = getLastOptions;
function getNumTranslations() {
    return numTranslations;
}
exports.getNumTranslations = getNumTranslations;
function init() {
    mock('@google-cloud/translate', function () { return exports.translate; });
}
exports.init = init;
