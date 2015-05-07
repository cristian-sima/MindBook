/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = app | null;

function App() {
  this.editor = null;
  this.db = new Database();
  this.storage = new Storage();
  this.menu = new Menu();
  this.init();
}

App.prototype.init = function () {
  this.editor = new Editor("editor_textarea");
};

App.prototype.log = function (text) {
  console.log(text);
};

App.prototype.warn = function (text) {
  console.log(text);
};