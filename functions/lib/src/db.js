"use strict";
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
var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
function get(path) {
    return admin.database().ref(path).once('value').then(function (snapshot) {
        return snapshot.val();
    });
}
exports.get = get;
function set(path, value) {
    return admin.database().ref(path).set(value);
}
exports.set = set;
function push(path, value) {
    return admin.database().ref(path).push(value);
}
exports.push = push;
function remove(path) {
    return admin.database().ref(path).remove();
}
exports.remove = remove;
function transaction(path, callback) {
    return admin.database().ref(path).transaction(callback);
}
exports.transaction = transaction;
