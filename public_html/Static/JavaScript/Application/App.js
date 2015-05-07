/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = app | null;

function App() {
  this.storage = new Storage();
  this.menu = new Menu();
  this.gateway  = new Gateway();
  this.layout = new Layout();
  this.init();
}

App.prototype.init = function () {
  
};