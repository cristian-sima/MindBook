/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * It inserts an element at a given position
 * @param {type} index The position of the item (from 0 to array.length - 1)
 * @param {type} item The item
 */
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};
Array.prototype.copy = function () {
    return this.slice();
};
Object.size = function (obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    } else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    }
}

function isURL(textval) {
    var urlregex = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    return urlregex.test(textval);
}

function setCaretToPos(input, pos, end) {
    if (pos === "END") {
        $(input).focusToEnd();
    } else if (pos === "START") {
        setSelectionRange(input, 0, 0);
    } else {
        setSelectionRange(input, pos, end);
    }
}
String.prototype.insertAt = function (index, string) {
    return this.substr(0, index) + string + this.substr(index);
}
$.fn.focusToEnd = function () {
    return this.each(function () {
        var v = $(this).val();
        $(this).focus().val("").val(v);
    });
};

function replaceSearchedTerm(data, search, patern) {
    if (!data) {
        data = "";
    }

    function preg_quote(str) {
        // http://kevin.vanzonneveld.net
        // +   original by: booeyOH
        // +   improved by: Ates Goral (http://magnetiq.com)
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Onno Marsman
        // *     example 1: preg_quote("$40");
        // *     returns 1: '\$40'
        // *     example 2: preg_quote("*RRRING* Hello?");
        // *     returns 2: '\*RRRING\* Hello\?'
        // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
        // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'
        return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
    }
    return data.replace(new RegExp("(" + preg_quote(search) + ")", 'gi'), patern);
}