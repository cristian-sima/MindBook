/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = app | null;

function Storage() {
  this.reset();
}

Storage.prototype = {
  reset: function () {
    this.data = new Idea(null, "Home");
  },
  getHome: function () {
    return this.data;
  },
  getHTML: function () {
    return this.getHome().getHTML();
  },
  /**
   * Creates a new Idea an links it to the home root idea
   * @param {type} data The text of the idea
   * @returns {Idea} The new idea
   */
  createNewIdea: function (data) {
    var newIdea = new Idea(null, data);
    this.linkIdea(this.getHome(), newIdea);
    return newIdea;
  },
  linkIdea: function (parent, child) {
    parent.addChild(child);
  }
};