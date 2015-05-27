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
    Data.prepare = function (data) {
        var temp = {
            id: parseInt(data.id, 10),
            parent: parseInt(data.parent, 10),
            content: data.content
        },
            i = 0,
            child = null,
            c = null,
            parent = null;
        temp.children = [];

        function findParentOfChild(current, id) {
            var current_child = null,
                iterator = null,
                found = null;
            if (current.id === id) {
                return current;
            }
            for (iterator = 0; iterator < current.children.length; iterator = iterator + 1) {
                current_child = current.children[iterator];
                found = findParentOfChild(current_child, id);
                if (found) {
                    return found;
                }
            }
            return null;
        }
        for (i = 0; i < data.children.length; i = i + 1) {
            c = data.children[i];
            child = {
                id: parseInt(c.id, 10),
                content: c.content,
                children: []
            };
            parent = findParentOfChild(temp, parseInt(c.parent, 10));
            if (!parent) {
                console.log("Nu am gasit parinte pentru " + c.id + ". Trebuia sa fie parintele " + c.parent);
                console.log("Toate datele:  ");
                console.log(data);
                throw "Problem with pre-processing !";
            }
            parent.children.push(child);
            child.parent = parent;
        }
        return temp;
    };
}($));