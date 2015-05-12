/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Editor = function Editor(startingID) {
    this.home = null;
    this.counter = 1;
    this.currentIdea;
    this.init();
};
Editor.prototype = {
    init: function () {
        this.createHomeIdea();
        this.createIdea(this.home);
    },
    loadData: function (startingID) {
        
    },
    createHomeIdea: function () {
        this.home = new HomeIdea();
        this.home.insert(null);
    },
    createIdea: function (parent) {
        var idea = this.currentIdea,
            previousIdea = idea,
            newIdea = null;
        if (idea && idea.isParent()) {
            previousIdea = idea.getIndexOfLastIdeaFromChildren();
        }
        newIdea = new ChildIdea(this.counter);
        newIdea.insert(previousIdea);
        newIdea.setParent(parent, idea);
        this.setCurrentIdea(newIdea);
        this.incrementCounter();
    },
    incrementCounter: function () {
        this.counter = this.counter + 1;
    },
    setCurrentIdea: function (idea) {
        var oldIdea = this.currentIdea;
        if (!idea.id) {
            return;
        }
        if (oldIdea) {
            oldIdea.deselect();
        }
        this.currentIdea = idea;
        this.currentIdea.select();
    },
    getIdeaByIndex: function (id) {
        return this.home.getChildByIndex(id);
    },
    moveUp: function () {
        var idea = this.currentIdea,
            previous = null;
        previous = idea.getParent().getPreviousChild(idea);
        if (previous) {
            if (previous.isParent()) {
                previous = previous.getIndexOfLastIdeaFromChildren();
            } else {
                previous = idea.getParent().getPreviousChild(idea);
            }
        } else {
            // nu a mai gasit
            previous = idea.getParent();
        }
        if (previous) {
            this.setCurrentIdea(previous);
        }
    },
    moveDown: function () {
        var idea = this.currentIdea,
            parent = idea.getParent(),
            nextIdea = null;
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
            this.setCurrentIdea(nextIdea);
        }
    },
    removeIdea: function (idea, event) {
        if (this.canIdeaBeRemoved(idea)) {
            event.preventDefault();
            idea.removeIdeaAndSaveChildren();
            idea = null;
        }
    },
    canIdeaBeRemoved: function (idea) {
        if (idea.getContent().length === 0) {
            if (idea.getParent().id === this.home.id) {
                if (this.home.getNumberOfChildren() !== 1) {
                    return true;
                }
                return false;
            }
            return true;
        }
        return false;
    },
    getData: function () {
        return JSON.stringify(this.home.getJSON());
    },
    close: function () {
        this.home.remove();
        this.home = null;
    }
};