/*global app, Editor, HomeIdea, ChildIdea, Class,Data*/
(function () {
    "use strict";
    var EditorTemplate = {
        // constructor
        init: function (id, containerId, type) {
            this.container = $("#" + containerId);
            this.type = type;
            this.getDataFromServer(id);
        },
        getDataFromServer: function (id) {
            var editor = this;
            app.gateway.getEntireIdea(id, function (data) {
                data = Data.prepare(data);
                editor.loadData(data);
            });
        },
        loadData: function (data) {},
        loadFirstIdea: function (firstChild) {
            var childIdea = this.createFirstChildIdea({
                id: firstChild.id,
                content: firstChild.content,
                server: firstChild.id
            });
            // load its children
            this.loadIdeas(childIdea, firstChild.children);
            return childIdea;
        },
        loadIdeas: function (parentIdea, children) {
            var iterator = null,
                child = null,
                childIdea;
            for (iterator = 0; iterator < children.length; iterator = iterator + 1) {
                child = children[iterator];
                childIdea = this.createChildIdea(parentIdea, child);
                this.loadIdeas(childIdea, child.children);
            }
        },
        createHomeIdea: function (info) {
            this.home = new HomeIdea(info, this);
        },
        createNewFirstChildIdea: function () {
            var idea = this.createFirstChildIdea({
                id: this.getCounter(),
                content: "",
                server: null
            });
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
                position: parent.getNumberOfChildren() + 1,
                server: info.id
            });
            return newIdea;
        },
        createEmptyIdea: function (parentIdea, position) {
            var newIdea = parentIdea.createBrother({
                id: this.getCounter(),
                parent: parentIdea,
                position: position,
                content: "",
                server: null
            });
            this.incrementCounter();
            return newIdea;
        },
        incrementCounter: function () {
            app.incrementCounter();
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
                app.gateway.removeIdea({
                    id: idea.id
                }, function (data) {});
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
        getContainer: function () {
            return this.container;
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
            }(idea));
            app.gateway.createIdea({
                id: id,
                parent: parent,
                content: content
            }, functie);
        },
        getCounter: function () {
            return app.getCounter();
        },
        updateIdeaOnServer: function (info, idea) {
            this.incrementCounter();
            var functie = (function () {
                var i = idea;
                return function (report) {
                    if (i) {
                        var serverIdea = i.getServerIdea();
                        switch (report.status) {
                            case "correspondence":
                                serverIdea.setId(parseInt(report.id, 10));
                                serverIdea.setCorrelatedId(parseInt(report.id, 10));
                                break;
                            case "create":
                            case "update":
                                serverIdea.setId(parseInt(report.id, 10));
                                serverIdea.setCorrelatedId(null);
                                break;
                        }
                        i.updateLine();
                    }
                };
            }(idea));
            app.gateway.updateIdea(info, functie);
        },
        isStandard: function () {
            return this.type === "Standard";
        },
        isDefault: function () {
            return this.type === "Default";
        },
        close: function () {
            if (this.home) {
                this.home.remove();
                this.home = null;
            }
        }
    };
    Editor = Class.extend(EditorTemplate);
}());