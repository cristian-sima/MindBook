/*global app, Editor, HomeIdea, ChildIdea*/
(function () {
    'use strict';
    Editor = function Editor(data, container) {
        this.container = container;
        this.counter = app.counter;
        this.currentIdea = null;
        this.init(data);
    };
    Editor.prototype = {
        init: function (data) {
            this.createHomeIdea({
                id: data.id,
                content: data.content
            });
            var childIdea = this.createFirstChildIdea({
                id: 2,
                content: ""
            });
            this.setCurrentIdea(childIdea);
        },
        createHomeIdea: function (info) {
            this.home = new HomeIdea(info.id, info.content, this);
        },
        createFirstChildIdea: function (info) {
            var parent = this.home,
                position = 0,
                idea = new ChildIdea(info, this.home);
            parent.addChildAtPosition(idea, position);
            idea.setLine(parent.getLine());
            return idea;
        },
        createEmptyIdea: function (parent, position) {
            var newIdea = parent.createBrother({
                id: this.counter,
                content: "",
                parent: parent,
                position: position
            });
            this.incrementCounter();
            return newIdea;
        },
        incrementCounter: function () {
            this.counter = this.counter + 1;
        },
        setCurrentIdea: function (idea) {
            var oldIdea = this.currentIdea;
            if (!idea.id) {
                throw "It is not idea";
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
            previous = idea.getParent().getChildBefore(idea);
            if (previous) {
                if (previous.isParent()) {
                    previous = previous.getLastPossibleChild();
                } else {
                    previous = idea.getParent().getChildBefore(idea);
                }
            } else {
                // nu a mai gasit
                previous = idea.getParent();
            }
            if (previous && !previous.isHome()) {
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
                    nextIdea = idea.getParent().getChildAfter(idea);
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
        getContainer: function () {
            return this.container;
        },
        close: function () {
            this.home.remove();
            this.home = null;
        },
        fired_enterKeyPressed: function (idea) {
            var newIdea = this.createEmptyIdea(idea, idea.getPosition() + 1);
            this.setCurrentIdea(newIdea);
        },
        createChildIdea: function (info) {
            var newIdea = new ChildIdea(info, this.home);
            return newIdea;
        }
    };
}());