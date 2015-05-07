/* 
	* To change this license header, choose License Headers in Project Properties.
	* To change this template file, choose Tools | Templates
	* and open the template in the editor.
	*/

var app = app | null;

function Textarea(id, editor) {
		this.editor = editor;
		this.id = id;
		this.element = $("#" + id);
}

Textarea.prototype.init = function () {
  this.activateListeners();
  this.activateAutoSizeForTextarea();
		this.focus();
};

Textarea.prototype.activateListeners = function () {
  this.element.on("keydown", function(event) {
				app.editor.keyDownEventFired(event);
		});
		this.element.on("keyup", function(event) {
				app.editor.keyUpEventFired(event);
		});
};

Textarea.prototype.activateAutoSizeForTextarea = function () {
  autosize(this.element);
};

Textarea.prototype.focus = function () {
		this.element.focus();
};

Textarea.prototype.updateText = function (newValue) {
		this.element.val(newValue);
};

Textarea.prototype.getText = function () {
		return this.element.val();
};
