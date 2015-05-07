/* 
	* To change this license header, choose License Headers in Project Properties.
	* To change this template file, choose Tools | Templates
	* and open the template in the editor.
	*/

var app = app | null;

function Canvas (editor) {
		this.editor = editor;
		this.id = "canvas";
		this.element = $("#" + this.id);
    this.init();
};

Canvas.prototype.init = function() {
  // create an empty textIdea
};