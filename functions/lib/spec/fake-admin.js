"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mock = require("mock-require");
var fakeAdmin = {
    initializeApp: function () { },
    database: function () {
        throw Error('Wow, this fake firebase-admin should not actually be used!');
    },
};
function init() {
    mock('firebase-admin', fakeAdmin);
}
exports.init = init;
