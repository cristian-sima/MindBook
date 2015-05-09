/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = app | null,
  Idea;

function App() {

  this.id = "app";
  this.element = $("#" + this.id);

  this.currentIdea = null;
  this.home = null;
  this.counter = 1;

  this.init();
}

App.prototype = {
  init: function () {
    this.createHomeIdea();
    this.createIdea(this.home);
    this.loadData();
  },
  createHomeIdea: function () {
    this.home = new HomeIdea(null, "Home");
    this.home.insert(null);
  },
  createIdea: function (parent) {

    var idea = this.currentIdea,
      previousIdea = idea;

    if (idea && idea.isParent()) {
      previousIdea = idea.getPositionOfLastIdeaFromChildren();
    }

    var newIdea = new ChildIdea(this.counter);
    newIdea.insert(previousIdea);
    newIdea.setParent(parent, idea);

    this.changeCurrentIdea(newIdea);
    this.counter++;
  },
  loadData: function () {
    this.data = new Data();
  },
  changeCurrentIdea: function (idea) {

    if (!idea.id) {
      return;
    }

    if (this.currentIdea) {
      this.currentIdea.deselect();
    }

    this.currentIdea = idea;
    this.currentIdea.select();
  },
  findIdeadById: function (id) {
    return this.home.getChildById(id);
  },
  moveUp: function () {
    var idea = this.currentIdea,
      parent = idea.getParent(),
      previous = null;

    previous = idea.getParent().getPreviousChild(idea);

    if (previous) {
      if (previous.isParent()) {
         previous =  previous.getPositionOfLastIdeaFromChildren();
        
      } else {
        previous = idea.getParent().getPreviousChild(idea);
      }
    } else {
      // nu a mai gasit
      previous = idea.getParent();
    }

    if (previous) {
      this.changeCurrentIdea(previous);
    }
  },
  moveDown: function () {
    var idea = this.currentIdea,
      parent = idea.getParent();

    if (idea.isParent()) {
      nextIdea = idea.getFirstChild();
    } else {
      do {
        nextIdea = idea.getParent().getNextChild(idea);
        idea = parent;
        parent = parent.getParent();
      } while (!nextIdea && parent);
    }

    if (nextIdea) {
      this.changeCurrentIdea(nextIdea);
    }
  },
  shiftTabFired: function () {
    var idea = this.currentIdea;

    var previousBrother = idea.getParent().getParent();
    if (previousBrother) {
      //idea.parent.moveChildrenBellowToParent(idea);
      idea.setParent(previousBrother, idea.getParent());
    }
  },
  firedCurrentIdeaDeselected: function (id) {

  },
  firedCurrentIdeaSelected: function (id) {
    if (!id) {
      throw "No ID for choosing";
    }
    var idea = this.home.getChildById(id);
    if (idea) {
      this.changeCurrentIdea(idea);
    }
  },
  getIdeaById: function (id) {
    for (var i = 0; i < this.ideas.length; i++) {
      var idea = this.ideas[i];
      if (idea.id === id) {
        return idea;
      }
    }
    throw "No idea";
  }
};