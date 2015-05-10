/*global $*/
(function () {
    'use strict';
    Data = function Data() {
        this.keys = {
            "TAB": {
                code: 9,
                symbol: "\t",
                special: true
            },
            "ENTER": {
                code: 13,
                symbol: "\n",
                special: true
            },
            "ARROW-UP": {
                code: 38,
                special: true
            },
            "ARROW-DOWN": {
                code: 40,
                special: true
            },
            "BACKSPACE": {
                code: 8,
                special: false
            }
        };
    };
    Data.prototype = {
        isSpecialKey: function (keyCode) {
            var keyName = null,
                key = null;
            for (keyName in this.keys) {
                key = this.keys[keyName];
                if (key.code === keyCode && key.special) {
                    return true;
                }
            }
            return false;
        }
    };
}($));