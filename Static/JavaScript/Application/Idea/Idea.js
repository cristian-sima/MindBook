/*global app,Class,$,ChildIdea,ServerIdea*/
(function () {
    "use strict";
    var IdeaTemplate = {
        // constructor
        init: function (id, content, serverId) {
            this.id = parseInt(id, 10);
            this.children = [];
            this.parent = null;
            this.content = content;
            this.serverIdea = new ServerIdea(this);
            this.serverIdea.setId(serverId);
        },
        /* Its methods */
        getParent: function () {
            return this.parent;
        },
        setContent: function (content) {
            this.content = content;
        },
        getContent: function () {
            return this.content;
        },
        getEditor: function () {
            return this.getHome().getEditor();
        },
        getLine: function () {
            return this.line;
        },
        getPosition: function () {
            return this.getParent().getPositionOfChild(this);
        },
        getJSON: function () {
            var data = {
                "id": this.id,
                "content": this.getContent(),
                "children": {}
            },
                position = null,
                child = null;
            for (position = 0; position < this.children.length; position = position + 1) {
                child = this.children[position];
                data.children[child.id] = child.getJSON();
            }
            return data;
        },
        remove: function () {
            var position, child;
            for (position = 0; position < this.children.length; position = position + 1) {
                child = this.children[position];
                child.remove();
                child = null;
            }
            if (this.getParent()) {
                this.getParent().removeChild(this);
            }
            this.getLine().remove();
            this.line = null;
        },
        update: function () {
            this.updateLine();
        },
        updateLine: function () {
            if (this.getLine()) {
                this.getLine().update();
            }
        },
        /* Parent Methods */
        createBrother: function (childInfo) {
            var home = this.getHome(),
                parent = this.getParent(),
                position = childInfo.position,
                idea = new ChildIdea(childInfo, home),
                ideaBefore = null;
            if (this.isParent()) {
                ideaBefore = this.getLastPossibleChild();
            } else {
                ideaBefore = parent.getChildAtPosition(position - 1);
            }
            if (!ideaBefore) {
                ideaBefore = this;
            }
            parent.addChildAtPosition(idea, position);
            idea.setLine(ideaBefore.getLine());
            return idea;
        },
        createChild: function (childInfo) {
            var home = this.getHome(),
                parent = this,
                position = childInfo.position,
                idea = new ChildIdea(childInfo, home),
                ideaBefore = null;
            if (this.getNumberOfChildren === 0) {
                ideaBefore = this;
            } else {
                ideaBefore = this.getLastPossibleChild();
            }
            if (!ideaBefore) {
                ideaBefore = this;
            }
            parent.addChildAtPosition(idea, position);
            idea.setLine(ideaBefore.getLine());
            return idea;
        },
        removeChild: function (child) {
            var position = this.getPositionOfChild(child);
            if (position > -1) {
                this.children.splice(position, 1);
            }
            this.updateLine();
        },
        addChild: function (child) {
            this.addChildAtPosition(child, 0);
            this.getServerIdea().addIdea();
        },
        addChildAtPosition: function (child, position) {
            this.children.insert(position, child);
            this.updateLine();
            if (child.getParent()) {
                child.getParent().removeChild(child);
            }
            child.setParent(this);
            child.updateLevel();
        },
        getChildAtPosition: function (position) {
            return this.children[position];
        },
        getChildById: function (id) {
            var position, child, result;
            for (position = 0; position < this.children.length; position = position + 1) {
                child = this.children[position];
                if (child.id === id) {
                    return child;
                }
                result = child.getChildByIndex(id);
                if (result) {
                    return result;
                }
            }
            return null;
        },
        getPositionOfChild: function (currentIdea) {
            var position, idea;
            for (position = 0; position < this.children.length; position = position + 1) {
                idea = this.children[position];
                if (idea.id === currentIdea.id) {
                    return position;
                }
            }
            return null;
        },
        getLastPossibleChild: function () {
            if (this.isParent()) {
                var lastChild = this.getLastChild();
                return lastChild.getLastPossibleChild();
            }
            return this;
        },
        getFirstChild: function () {
            return this.children[0];
        },
        getLastChild: function () {
            return this.children[this.children.length - 1];
        },
        getChildBefore: function (currentIdea) {
            var position, idea;
            for (position = this.children.length - 1; position > 0; position = position - 1) {
                idea = this.children[position];
                if (idea.id === currentIdea.id) {
                    return this.children[position - 1];
                }
            }
            return null;
        },
        getChildAfter: function (currentIdea) {
            var position, idea;
            for (position = 0; position < this.children.length - 1; position = position + 1) {
                idea = this.children[position];
                if (idea.id === currentIdea.id) {
                    return this.children[position + 1];
                }
            }
            return null;
        },
        isParent: function () {
            return (this.getNumberOfChildren() !== 0);
        },
        hasParent: function () {
            return (this.parent !== null);
        },
        hasChildren: function () {
            return this.isParent();
        },
        getNumberOfChildren: function () {
            return this.children.length;
        },
        fired_childSelected: function () {
            // empty
        },
        fired_childRealeased: function () {
            // empty
        },
        updateLevel: function () {
            // empty
        },
        getId: function () {
            return this.id;
        },
        getServerIdea: function () {
            return this.serverIdea;
        },
        updateOnServer: function () {
            // empty
        },
        isCorelated: function () {
            // to do
        }
    };
    Idea = Class.extend(IdeaTemplate);
}($));