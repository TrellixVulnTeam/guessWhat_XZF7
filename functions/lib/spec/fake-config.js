"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sinon = require("sinon");
var functions = require("firebase-functions");
function init() {
    sinon.stub(functions, 'config').returns({
        firebase: {
            storageBucket: 'fake-bucket',
            databaseURL: 'https://testingfake.firebaseio.com',
        },
    });
}
exports.init = init;
