/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = app | null;

function Editor(textareaID) {
  var instance = this;
  this.textarea = new Textarea(textareaID);
  this.processor = new Processor(instance);
		this.layout = new Layout(instance);
  this.init();
}

Editor.prototype.init = function () {
  this.textarea.init();
};

Editor.prototype.keyDownEventFired = function (event) {
  var keyCode = event.keyCode || event.which;
  var element = this.textarea.element;
  switch (keyCode) {
    case app.db.keys["TAB"].code:
      event.preventDefault();
      var start = element.get(0).selectionStart;
      var end = element.get(0).selectionEnd;
      // set textarea value to: text before caret + tab + text after caret
      element.val(element.val().substring(0, start) + app.db.keys["TAB"].symbol + element.val().substring(end));
      // put caret at right position again
      element.get(0).selectionStart = element.get(0).selectionEnd = start + 1;
      break;
  }
};

Editor.prototype.keyUpEventFired = function (event) {
  this.processor.processEntireText();
		this.layout.update();
};


/* Work done until here*/


/*
function activateTabKeyForInput() {
  $(document).delegate('#my_textarea', 'keydown', function (e) {
    try {
      addTab(e);
    } catch (E) {

    }
  });


  $(document).delegate('#my_textarea', 'keyup', function () {
    console.log("Aplicatia proceseaza textul");
    app.start();
  });
}

function addTab(e) {

  var element = $("my_textarea");
  var keyCode = e.keyCode || e.which;
  if (keyCode === 9) {
    e.preventDefault();
    var start = element.get(0).selectionStart;
    var end = element.get(0).selectionEnd;

    console.log("Start: " + start);
    console.log("End: " + end)
    // set textarea value to: text before caret + tab + text after caret
    element.val(element.val().substring(0, start) + "\t" + element.val().substring(end));

    throw new Exception();
    element.get(0).selectionStart = element.get(0).selectionEnd = start + 1;

    // put caret at right position again
  }
}

function _temp() {
  app.start();
}

Editor.prototype.process = function () {

  this.processor.
  this.lines = this.extractLines(this.value);

  var parent = this.getLine(1);
  var child = this.getLine(2);

  var pair = new Pair(parent, child);

  return pair.getHTML();
};

Editor.rototype.getLine = function (numberOfLine) {
  return this.lines[numberOfLine - 1];
};

Editor.prototype.extractLines = function (givenText) {
  return givenText.split('\n');
};


Editor.prototype.getTextareaContent = function () {
  return this.textareaHTMLElement.val();
};

Editor.prototype.updateTextarea = function (newText) {
  this.textareaHTMLElement.val(newText);
};


*/