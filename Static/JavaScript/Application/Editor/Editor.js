/*global app, Editor, HomeIdea, ChildIdea, Class,Data*/
(function () {
    "use strict";
    var EditorTemplate = {
        // constructor
        init: function (id, containerId, type) {
            this.container = $("#" + containerId);
            this.type = type;
            this.waitingList = [];
            this.requestList = [];
            this.requestId = 1;
            this.ideas = {};
            this.getDataFromServer(id);
        },
        registerIdea: function (idea) {
            this.ideas[idea.id] = idea;
        },
        unregisterIdea: function (idea) {
            delete this.ideas[idea.id];
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
                childIdea = null;
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
        setCurrentIdea: function (idea, cursorPosition, cursorPositionEnds) {
            var oldIdea = this.currentIdea,
                line = null,
                textarea = null;
            if (!idea.id) {
                throw "It is not idea";
            }
            if (oldIdea) {
                line = oldIdea.getLine();
                textarea = line.getTextarea();
                oldIdea.deselect();
            }
            this.currentIdea = idea;
            this.currentIdea.select(cursorPosition, cursorPositionEnds);
        },
        getIdeaByIndex: function (id) {
            return this.home.getChildByIndex(id);
        },
        getIdeaById: function (id) {
            return this.ideas[id];
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
                this.setCurrentIdea(previous, "END");
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
                this.setCurrentIdea(nextIdea, "START");
            }
        },
        removeIdea: function (idea, event) {
            var callbackSuccess = null,
                callbackError = null;
            if (this.canIdeaBeRemoved(idea)) {
                event.preventDefault();
                callbackSuccess = (function () {
                    var correlatedId = idea.getServerIdea().getCorrelatedId(),
                        editor = idea.getEditor();
                    return function () {
                        editor.updateCorrelatedIdeas(correlatedId);
                    };
                })(), callbackError = app.gateway.connectionLost;
                app.gateway.removeIdea({
                    id: idea.id
                }, callbackSuccess, callbackError);
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
        createIdeaOnServer: function (id, content, parent, idea) {
            var callbackSuccess = function () {},
                callbackError = app.gateway.connectionLost;
            app.gateway.createIdea({
                id: id,
                parent: parent,
                content: content
            }, callbackSuccess, callbackError);
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
                    var editor = i.getEditor();
                    editor.fired_requestReceived(report);
                };
            }(idea)),
                errorCallback = function () {
                    app.gateway.connectionLost();
                };
            app.gateway.updateIdea(info, functie, this.requestId, errorCallback);
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
                this.remove();
            }
        },
        remove: function () {
            if (this.home) {
                this.home.remove();
                this.home = null;
            }
            this.container.html("");
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
        },
        fired_enterKeyPressed: function (idea) {
            var newIdea = this.createEmptyIdea(idea, idea.getPosition() + 1);
            this.setCurrentIdea(newIdea);
        },
        fired_requestReceived: function (serverReport) {
            var requestId = serverReport.requestId,
                ideas = serverReport.ideas,
                iterator = 0,
                idea = null,
                serverIdea = null,
                ideaReport = null,
                indexOfRequest = this.requestList.indexOf(requestId),
                localId = null;
            for (iterator in ideas) {
                ideaReport = ideas[iterator];
                localId = parseInt(ideaReport.clientIdeaId, 10);
                idea = this.getIdeaById(localId);
                serverIdea = idea.getServerIdea();
                switch (ideaReport.status) {
                    case "creation":
                        serverIdea.removeCorrelation();
                        break;
                    case "modification":
                        serverIdea.removeCorrelation();
                        break;
                    case "correlation":
                        serverIdea.correlate(parseInt(ideaReport.correlatedId, 10));
                        break;
                    case "nothing_done":
                        break;
                }
                // update the correlated ones
                this.updateCorrelatedIdeas(localId);
            }
            this.requestList.splice(indexOfRequest, 1);
            if (this.requestList.length === 0 && this.callbackRequestsOver) {
                this.remove();
                this.callbackRequestsOver();
            }
        },
        updateCorrelatedIdeas: function (oldCorrelatedId) {
            var iterator = null,
                idea = null,
                correlatedId = null;
            for (iterator in this.ideas) {
                if (this.ideas.hasOwnProperty(iterator)) {
                    idea = this.ideas[iterator];
                    correlatedId = idea.getServerIdea().getCorrelatedId();
                    if (idea.isCorrelated() && idea.getId() !== oldCorrelatedId && correlatedId === oldCorrelatedId) {
                        idea.update();
                    }
                }
            }
        }
    };
    Editor = Class.extend(EditorTemplate);
}());