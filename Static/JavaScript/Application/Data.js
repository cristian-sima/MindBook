/*global $*/
(function () {
    'use strict';
    Data = function Data() {
        this.keys = {
            "TAB": {
                code: 9,
                symbol: "\t",
                special: true,
                canModifyText: false
            },
            "ENTER": {
                code: 13,
                symbol: "\n",
                special: true,
                canModifyText: false
            },
            "ARROW-UP": {
                code: 38,
                special: true,
                canModifyText: false
            },
            "ARROW-DOWN": {
                code: 40,
                special: true,
                canModifyText: false
            },
            "BACKSPACE": {
                code: 8,
                special: false,
                canModifyText: true
            },            
            "ARROW-LEFT": {
                code: 37,
                special: false,
                canModifyText: false
            },
            "ARROW-RIGHT": {
                code: 39,
                special: false,
                canModifyText: false
            }
        };
    };
    Data.prototype = {
        isSpecialKey: function (keyCode) {
            var keyName = null,
                key = null;
            for (keyName in this.keys) {
                key = this.keys[keyName];
                if (key.code === keyCode && key.special === true) {
                    return true;
                }
            }
            return false;
        },
        isModyfingKey: function (keyCode) {
            var keyName = null,
                key = null;
            for (keyName in this.keys) {
                key = this.keys[keyName];
                if (key.code === keyCode && key.canModifyText === false) {
                    return false;
                }
            }
            return true;
        }
    };
}($));