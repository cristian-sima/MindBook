/*global app,Class,$*/
(function () {
    "use strict";
    var IdeaTemplate = {
        // constructor
        init: function (id) {
            this.id = id;
            this.level = 0;
            this.children = [];
            this.parent = null;
            this.content = id;
        },
        insert: function (previousIdea) {
            var HTML = this.getHTML();
            if (!previousIdea) {
                $("#app").append(HTML);
            } else {
                $(HTML).insertAfter(previousIdea.element);
            }
            this.getJQueryElements();
            this.activateListeners();
        },
        addChild: function (child, previousItem) {
            var position = null;
            if (previousItem) {
                position = previousItem.getParent().getChildIndex(previousItem) + 1;
                if (position === 0) {
                    position = previousItem.getParent().getNumberOfChildren();
                }
            } else {
                position = 0;
            }
            this.children.insert(position, child);
        },
        removeChild: function (child) {
            var index = this.children.indexOf(child);
            if (index > -1) {
                this.children.splice(index, 1);
            }
            this.updateLevel();
            this.updateHTML();
        },
        getChildById: function (id) {
            var i, child, result;
            for (i = 0; i < this.children.length; i = i + 1) {
                child = this.children[i];
                if (child.id === id) {
                    return child;
                }
                result = child.getChildById(id);
                if (result) {
                    return result;
                }
            }
            return null;
        },
        getChildIndex: function (currentIdea) {
            var j, idea;
            for (j = 0; j < this.children.length; j = j + 1) {
                idea = this.children[j];
                if (idea.id === currentIdea.id) {
                    return j;
                }
            }
            return -1;
        },
        getPositionOfLastIdeaFromChildren: function () {
            if (this.isParent()) {
                var lastChild = this.getLastChild();
                return lastChild.getPositionOfLastIdeaFromChildren();
            }
            return this;
        },
        getPreviousChild: function (currentIdea) {
            var i, idea;
            for (i = this.children.length - 1; i > 0; i = i - 1) {
                idea = this.children[i];
                if (idea.id === currentIdea.id) {
                    return this.children[i - 1];
                }
            }
            return null;
        },
        getNextChild: function (currentIdea) {
            var i, idea;
            for (i = 0; i < this.children.length - 1; i = i + 1) {
                idea = this.children[i];
                if (idea.id === currentIdea.id) {
                    return this.children[i + 1];
                }
            }
            return null;
        },
        getFirstChild: function () {
            return this.children[0];
        },
        getLastChild: function () {
            return this.children[this.children.length - 1];
        },
        isParent: function () {
            return (this.getNumberOfChildren() !== 0);
        },
        getParent: function () {
            return this.parent;
        },
        getContent: function () {
            return this.content;
        },
        setContent: function (content) {
            this.content = content;
        },
        hasParent: function () {
            return (!this.getParent);
        },
        getChildPosition: function (child) {
            return this.children.indexOf(child);
        },
        getNumberOfChildren: function () {
            return this.children.length;
        },
        updateHTML: function () {},
        updateLevel: function () {},
        getHTML: function () {},
        getJQueryElements: function () {},
        activateListeners: function () {},
        select: function () {},
        deselect: function () {}
    };
    Idea = Class.extend(IdeaTemplate);
}($));