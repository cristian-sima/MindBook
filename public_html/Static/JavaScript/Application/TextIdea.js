/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = app | null;

function CanvasIdea(id, editor) {
		this.editor = editor;
		this.id = id;
		this.element = $("#" + id);
}

CanvasIdea.prototype.init = function () {
  this.activateListeners();
  this.activateAutoSizeForTextarea();
		this.focus();
};

CanvasIdea.prototype.activateListeners = function () {
  this.element.on("keydown", function(event) {
				app.editor.keyDownEventFired(event);
		});
		this.element.on("keyup", function(event) {
				app.editor.keyUpEventFired(event);
		});
};

CanvasIdea.prototype.activateAutoSizeForTextarea = function () {
  autosize(this.element);
};

CanvasIdea.prototype.focus = function () {
		this.element.focus();
};

CanvasIdea.prototype.updateText = function (newValue) {
		this.element.val(newValue);
};

CanvasIdea.prototype.getText = function () {
		return this.element.val();
};
