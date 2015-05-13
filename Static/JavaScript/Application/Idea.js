/*global app,Class,$*/
(function () {
    "use strict";
    var IdeaTemplate = {
        // constructor
        init: function (id, content) {
            this.id = parseInt(id);
            this.level = 0;
            this.children = [];
            this.parent = null;
            this.content = content;
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
        getChildByIndex: function (id) {
            var i, child, result;
            for (i = 0; i < this.children.length; i = i + 1) {
                child = this.children[i];
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
        getIndexOfLastIdeaFromChildren: function () {
            if (this.isParent()) {
                var lastChild = this.getLastChild();
                return lastChild.getIndexOfLastIdeaFromChildren();
            }
            return this;
        },
        getFirstChild: function () {
            return this.children[0];
        },
        getLastChild: function () {
            return this.children[this.children.length - 1];
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
        isParent: function () {
            return (this.getNumberOfChildren() !== 0);
        },
        getNumberOfChildren: function () {
            return this.children.length;
        },
        hasParent: function () {
            return (!this.getParent());
        },
        getParent: function () {
            return this.parent;
        },
        setContent: function (content) {
            this.content = content;
        },
        getContent: function () {
            return this.content;
        },
        insert: function (previousIdea) {
            this.insertHTMLElement(previousIdea);
            this.getJQueryElements();
            this.activateListeners();
        },
        getJSON: function () {
            var data = {
                "id": this.id,
                "content": this.getContent(),
                "children": {}
            },
                index = null,
                child = null;
            for (index = 0; index < this.children.length; index = index + 1) {
                child = this.children[index];
                data.children[child.id] = child.getJSON();
            }
            return data;
        },        
        remove: function () {
            var i, child;
            for(i=0; i< this.children.length; i++ ){
                child = this.children[i];
                child.remove();
                child = null;
            }
            if(this.textarea) {
                this.textarea.off();
                this.textarea.remove();
            }
            this.element.remove();
        },
        isHome: function () {},
        updateHTML: function () {},
        updateLevel: function () {},
        getHTML: function () {},
        select: function () {},
        deselect: function () {}
    };
    Idea = Class.extend(IdeaTemplate);
}($));