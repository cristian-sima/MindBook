/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = app | null;

function Menu () {
  this.id = "menu";
  this.element = "#meniu";
}

Menu.prototype = {
  init: function() {
    this.addListeners();
  },
  addListeners: function() {
    $("#adauga-button").click(function() {
      
    });
  }
};