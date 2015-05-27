/*global app, Editor, HomeIdea, ChildIdea, Class,Data*/
(function () {
    "use strict";
    var EditorTemplate = {
        // constructor
        init: function (id, containerId, type) {
            this.container = $("#" + containerId);
            this.type = type;
            this.getDataFromServer(id);
            this.waitingList = [];
            this.requestList = [];
            this.requestId = 1;
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
        setCurrentIdea: function (idea, cursorPosition) {
            var oldIdea = this.currentIdea,
                line = null,
                textarea = null;
            if (!idea.id) {
                throw "It is not idea";
            }
            if (oldIdea) {
                line = oldIdea.getLine();
                textarea = line.getTextarea();
                if (!cursorPosition) {
                    cursorPosition = textarea.prop("selectionStart");
                }
                oldIdea.deselect();
            }
            this.currentIdea = idea;
            this.currentIdea.select(cursorPosition);
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
            this.incrementRequestCounter();
            var functie = (function () {
                var i = idea;
                return function (report) {
                    var editor = i.getEditor(),
                        serverIdea = i.getServerIdea();
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
                    editor.requestList.splice(editor.requestList.indexOf(report.requestId), 1);
                    if (editor.callbackRequestsOver) {
                        console.log(editor.requestList.length);
                        if (editor.requestList.length === 0) {
                            console.log('done');
                            editor.callbackRequestsOver();
                        }
                    }
                };
            }(idea));
            app.gateway.updateIdea(info, functie, this.requestId);
            this.requestList.push(this.requestId);
        },
        incrementRequestCounter: function () {
            this.requestId = this.requestId + 1;
        },
        isStandard: function () {
            return this.type === "Standard";
        },
        isDefault: function () {
            return this.type === "Default";
        },
        close: function () {
            if (((this.waitingList.length !== 0) || (this.requestList.length !== 0))) {
                throw "Requests waiting";
            } else {
                if (this.home) {
                    this.home.remove();
                    this.home = null;
                }
            }
        },
        forceClose: function (callback) {
            var iterator = null,
                idea = null;
            for (iterator = 0; iterator < this.waitingList.length; iterator = iterator + 1) {
                idea = this.waitingList[iterator].idea;
                idea.update();
                this.waitingList.splice(iterator, 1);
            }
            this.setCallbackRequestsOver(callback);
        },
        setCallbackRequestsOver: function (callback) {
            this.callbackRequestsOver = callback;
        },
        addIdeaToWaitingList: function (idea) {
            this.waitingList.push({
                id: idea.id,
                idea: idea
            });
        },
        findIdeaIndexInWaitingList: function (idea) {
            var iterator = null;
            for (iterator = 0; iterator < this.waitingList.length; iterator = iterator + 1) {
                if (this.waitingList[iterator].id === idea.id) {
                    return iterator;
                }
            }
            return -1;
        },
        removeFromWaitingList: function (idea) {
            var index = this.findIdeaIndexInWaitingList(idea);
            if (index > -1) {
                this.waitingList.splice(index, 1);
            }
        }
    };
    Editor = Class.extend(EditorTemplate);
}());