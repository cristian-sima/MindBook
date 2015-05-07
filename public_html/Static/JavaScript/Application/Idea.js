/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var app = app | null;

function Idea(parent, data) {
  this.parent = parent;
  this.children = [];
  this.data = data.trim();
}

Idea.prototype = {
  getHTML: function () {

    var toReturn = "";

				toReturn += "<div class=''>";
    toReturn += this.getIdeaHTML();
				toReturn += this.getChildrenHTML();
    toReturn += "</div>";

    return toReturn;
  },
  getIdeaHTML: function () {
    var toReturn = "",
      typeOfIdea = (this.isHome() ? "home": (this.isParent() ? "parent" : "child"));

    toReturn += "<div class='idea " + typeOfIdea + "-idea'>";
    toReturn += this.getData();
    toReturn += "</div>";

    return toReturn;
  },
  getChildrenHTML: function () {
    var toReturn = "<div class='children-idea'>";
    if (this.isParent()) {
      for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];
        toReturn += child.getHTML();
      }
    }
				toReturn += "</div>";
    return toReturn;
  },
  addChild: function (newChild) {
    this.children.push(newChild);
    newChild.parent = this;
  },
		isHome: function () {
				return !this.parent;
		},
  isParent: function () {
    return this.children.length !== 0;
  },
  getData: function () {
    return (!this.data ? "" : this.data);
  }
};