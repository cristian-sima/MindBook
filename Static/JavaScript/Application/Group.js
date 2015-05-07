/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var app = app | null;

function Group(rawText) {
  this.lines = [];
  this.visitedLines = 0;
  this.extractLines(rawText);
}

Group.prototype = {
  extractLines: function (givenText) {
    //givenText = givenText.replace(/(\n\n)/gm, "");
    var rawLines = givenText.split('\n');
    this.lines.push(new Line("Home", 1));


    for (index = 0; index < rawLines.length; index++) {
      var content = rawLines[index];
      if (content.trim() === "") {
        content = "";
      }
      //if (content !== "") {
      this.lines.push(new Line("\t" + content, index + 2));
      //}
    }
  },
  getFirstLine: function () {
    return this.getLineByIndex(1);
  },
  getNextLine: function (currentIndex) {
    return this.getLineByIndex(currentIndex + 1);
  },
  getPreviousLine: function (currentIndex) {
    return this.getLineByIndex(currentIndex - 1);
  },
  getLineByIndex: function (index) {
    var line = this.lines[index - 1];
    return line;
  },
  markLine: function (lineIndex) {
    this.visitedLines++;
    this.getLineByIndex(lineIndex).mark();
  },
  getChildrenLinesOf: function (currentLineIndex) {
    var childrenLines = [],
      childrenLevel = null;
    try {
      var parentLine = this.getLineByIndex(currentLineIndex),
        childrenLevel = parentLine.level + 1,
        newChild = this.getNextLine(currentLineIndex);
      while (newChild) {
        if (newChild.level === childrenLevel) {
          childrenLines.push(newChild);
        } else if (newChild.level > childrenLevel) {
          /* 
											* check to see if it is not wrong indented
											* 
											* */
          var relativeParent = this.getPreviousLine(newChild.index),
            suspiciousLine = newChild;

          
										while (relativeParent.isWrongIndented()) {
            relativeParent = this.getPreviousLine(relativeParent.index);
          }

          if (suspiciousLine.level > relativeParent.level + 1) {
            suspiciousLine.markWrongIndented();
												suspiciousLine.level = relativeParent.level + 1;
            if (relativeParent === parentLine) {
              childrenLines.push(newChild);
            }
          }
        } else if (newChild.level <= childrenLevel) {
          throw "Haha";
        }
        newChild = this.getNextLine(newChild.index);
      }
    } catch (E) {} finally {
      return childrenLines;
    }
  },
  getUnmarkedLines: function () {
    var unmarkedLines = [];
    for (index = 0; index < this.lines.length; index++) {
      var line = this.getLineByIndex(index);
      if (!line.isMarked) {
        unmarkedLines.push(line);
      }
    }
    return unmarkedLines;
  }
  /*findLineRelativeParent: function (childIndex) {
				var parentLineIndex = 0;
    try {
      var childLine = this.getLineByIndex(childIndex),
								parentLevel = childLine.level - 1,
        newParent = this.gePreviousLine(childIndex);
      while (newParent) {
        if (newChild.level === childrenLevel) {
          childrenLines.push(newChild);
        } else if(newChild.level <= parentLine.level){
          throw "Haha";
        }
        newChild = this.getNextLine(newChild.index);
      }
    } catch (E) {} finally {
      return childrenLines;
    }
		}*/
};