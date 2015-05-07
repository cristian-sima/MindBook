/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var app = app | null;

function Processor(editorReference) {
  this.editor = editorReference;
}
Processor.prototype = {
  processEntireText: function () {
    app.storage.reset();
    this.processRawText();
  },
  processRawText: function () {
    var currentText = this.editor.textarea.getText();

    this.group = new Group(currentText), startingINDEX = 1, homeIdea = app.storage.getHome(), children = this.group.getChildrenLinesOf(startingINDEX);

    // console.warn('-------------------------------- Started ----------------------');
    traverse(this.group, children, homeIdea, this.group.getLineByIndex(startingINDEX));
    //console.log("---------------------------- End ------------------------------");
    //this.correctWrongIndentedIdeas();
  },
  correctWrongIndentedIdeas: function () {
    if (children.length !== 0) {
      // are copii
      
						var unmarkedLines = this.group.getUnmarkedLines(),
								group = this.group;
					
						unmarkedLines.forEach(function (line) {
        group.findLineRelativeParent(line);
      }(group));
    }
    console.log(this.group.visitedLines + " of " + this.group.lines.length);
  }
};

function traverse(group, children, parentIdea, currentLine) {
  console.log("Current line: " + currentLine.content + " - Level: " + currentLine.level);

  if (!currentLine.isMarked()) {
    var newIdea = new Idea(parentIdea, currentLine.content);

    app.storage.linkIdea(parentIdea, newIdea);

    group.markLine(currentLine.index);
  }
  if (children.length !== 0) {
    // are copii
    children.forEach(function () {
      return function (child) {
        traverse(group, group.getChildrenLinesOf(child.index), newIdea, child);
      };
    }(group, newIdea));
  }
}