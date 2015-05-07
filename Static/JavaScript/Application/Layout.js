/* 
	* To change this license header, choose License Headers in Project Properties.
	* To change this template file, choose Tools | Templates
	* and open the template in the editor.
	*/

var app = app | null;

function Layout (editor) {
		this.editor = editor;
		this.id = "visual_panel";
		this.element = $("#" + this.id);
};

Layout.prototype.update = function() {
		this.element.html(app.storage.getHTML());
};