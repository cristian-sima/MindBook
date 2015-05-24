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

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

$.fn.focusToEnd = function () {
  return this.each(function () {
    var v = $(this).val();
    $(this).focus().val("").val(v);
  });
};