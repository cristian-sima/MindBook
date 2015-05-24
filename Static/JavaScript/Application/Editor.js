/*global app, Editor, HomeIdea, ChildIdea*/
(function () {
    "use strict";
    var EditorTemplate = {
        // constructor
        init: function (data, container) {
            this.container = container;
            this.counter = app.counter;
            this.currentIdea = null;
            this.initEditor(data);
        },
        initEditor: function (data) {},
        loadFirstIdea: function (firstChild) {
            var childIdea = this.createFirstChildIdea({
                id: firstChild.id,
                content: firstChild.content
            });
            // load its children
            this.loadIdeas(childIdea, firstChild.children);
            return childIdea;
        },
        loadIdeas: function (parentIdea, children) {
            var childId = null,
                child = null,
                childIdea;
            for (childId in children) {
                if (children.hasOwnProperty(childId)) {
                    child = children[childId];
                    childIdea = this.createChildIdea(parentIdea, child);
                    this.loadIdeas(childIdea, child.children);
                }
            }
        },
        createHomeIdea: function (info) {
            this.home = new HomeIdea(info.id, info.content, this);
        },
        createNewFirstChildIdea: function () {
            var idea = this.createFirstChildIdea({
                id: this.counter,
                content: ""
            });
            this.createIdeaOnServer(this.counter, "", this.home.id, idea);
            this.incrementCounter();
            return idea;
        },
        createFirstChildIdea: function (info) {
            var parent = this.home,
                position = 0,
                idea = new ChildIdea(info, this.home);
            parent.addChildAtPosition(idea, position);
            idea.setLine(parent.getLine());
            return idea;
        },
        createChildIdea: function (parent, info) {
            var newIdea = parent.createChild({
                id: info.id,
                content: info.content,
                parent: parent,
                position: parent.getNumberOfChildren() + 1
            });
            return newIdea;
        },
        createEmptyIdea: function (parentIdea, position) {
            var newIdea = parentIdea.createBrother({
                id: this.counter,
                parent: parentIdea,
                position: position,
                content: ""
            });
            app.gateway.createIdea({
                id: this.counter,
                parent: parentIdea.id,
                content: ""
            }, function (status) {});
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
            if (this.home) {
                this.home.remove();
                this.home = null;
            }
        },
        fired_enterKeyPressed: function (idea) {
            var newIdea = this.createEmptyIdea(idea, idea.getPosition() + 1);
            this.setCurrentIdea(newIdea);
        },
        createIdeaOnServer: function (id, content, parent, idea) {
            var functie = (function () {
                var i = idea;
                return function (status) {
                    if (status !== true) {
                        i.getLine().showProblem("Ideea nu a fost adaugata.");
                    } else {
                        i.getLine().hideProblem();
                    }
                };
            }());
            app.gateway.createIdea({
                id: id,
                parent: parent,
                content: content
            }, functie);
        }
    };
    Editor = Class.extend(EditorTemplate);
}());