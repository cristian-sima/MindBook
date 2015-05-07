/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var app = app | null;

function Line(content, index) {
  function getLevel(text) {
    var counter = 0;
    for (c = 0; c < text.length; c++) {
      if (text.charAt(c) === '\t') {
        counter++;
      } else {
        return counter;
      }
    }
  }
  this.content = content;
  this.level = getLevel(content);
  this.index = index;
  this.visited = false;
  this.wrongIndented = false;
}

Line.prototype = {
  isParent: function () {
    return 0 !== this.getLevelOfLine(this.index);
  },
  mark: function () {
    this.visited = true;
  },
  unmark: function () {
    this.visited = false;
  },
  isMarked: function () {
    return this.visited;
  },
  markWrongIndented: function () {
    this.wrongIndented = true;
  },
  isWrongIndented: function () {
    return this.wrongIndented;
  }
};