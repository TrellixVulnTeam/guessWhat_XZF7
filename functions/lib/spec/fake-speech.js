"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mock = require("mock-require");
var response = ['unset fake response'];
var lastUrl = '';
var lastRequest = {};
exports.speech = {
    recognize: function (url, request) {
        lastUrl = url;
        lastRequest = request;
        return response;
    },
};
function setResponse(r) {
    response = r;
}
exports.setResponse = setResponse;
function getLastUrl() {
    return lastUrl;
}
exports.getLastUrl = getLastUrl;
function getLastRequest() {
    return lastRequest;
}
exports.getLastRequest = getLastRequest;
function init() {
    mock('@google-cloud/speech', function () { return exports.speech; });
}
exports.init = init;
