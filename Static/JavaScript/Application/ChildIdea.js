/*global app,Class,Idea,ChildLine,$*/
(function () {
    "use strict";
    var ChildIdeaTemplate = {
        init: function (info, home) {
            this.home = home;
            this._super(info.id, info.content, info.parent);
        },
        createLineElement: function (previousIdea) {
            this.line = new ChildLine(this, previousIdea.getLine());
        },
        changeParent: function (newParent) {
            var lastPosition = newParent.getNumberOfChildren();
            this.changeParentAtPosition(newParent, lastPosition);
        },
        changeParentAtPosition: function (newParent, position) {
            if (this.hasParent()) {
                this.getParent().removeChild(this);
            }
            this.parent = newParent;
            this.parent.addChild(this, position);
            this.updateLevel();
        },
        isHome: function () {
            return false;
        },
        getHome: function () {
            return this.home;
        },
        updateLevel: function () {
            var i, child;
            this.level = this.getParent().getLevel() + 1;
            for (i = 0; i < this.children.length; i = i + 1) {
                child = this.children[i];
                child.updateLevel();
            }
            this.update();
        },
        getLevel: function () {
            return this.level;
        },
        select: function () {
            this.getLine().select();
        },
        deselect: function () {
            this.getLine().deselect();
        },
        /* Listeners */
        fired_childSelected: function () {
            this.getLine().boldText();
        },
        fired_childRealeased: function () {
            this.getLine().unboldText();
        },
        fired_tabKeyPressed: function () {
            var previousIdea = this.getParent().getPreviousChild(this);
            if (previousIdea) {
                this.changeParent(previousIdea);
            }
        },
        /* to check */        
        removeIdeaAndSaveChildren: function () {
            var parent = this.getParent(),
                toBeSelected = parent.getPreviousChild(this),
                previousIdea = toBeSelected,
                i = null,
                child = null,
                realChildren = this.children.copy();
            if (!toBeSelected) {
                // este prima sau nu mai sus mai sus
                if (parent === app.editor.home) {
                    if (realChildren[0]) {
                        previousIdea = app.editor.home;
                        toBeSelected = realChildren[0];
                    } else {
                        previousIdea = toBeSelected = parent.getNextChild(this);
                    }
                } else {
                    previousIdea = toBeSelected = parent;
                }
            } else {
                if (toBeSelected.isParent()) {
                    toBeSelected = toBeSelected.getIndexOfLastIdeaFromChildren();
                }
            }
            if (parent && previousIdea && previousIdea.id === app.editor.home.id && parent.id === app.editor.home.id) {
                previousIdea = null;
            }
            for (i = 0; i < realChildren.length; i = i + 1) {
                child = realChildren[i];
                child.setParent(parent, previousIdea);
                previousIdea = child;
            }
            app.editor.setCurrentIdea(toBeSelected);
            this.getParent().removeChild(this);
            this.deleteHTML();
        },
        updateChildrenPosition: function () {
            var itemBefore = this,
                i = null,
                child = null;
            for (i = 0; i < this.children.length; i = i + 1) {
                child = this.children[i];
                itemBefore = child.getParent().getPreviousChild(child);
                if (!itemBefore) {
                    itemBefore = child.getParent();
                } else {
                    itemBefore = itemBefore.getIndexOfLastIdeaFromChildren();
                }
                child.deleteHTML();
                child.insert(itemBefore);
                itemBefore = child;
                child.updateChildrenPosition();
            }
            this.highLight();
        },
        reduceLevel: function () {
            var nextIdea = this.getParent().getNextChild(this),
                newParent = this.getParent().getParent(),
                oldParent = this.getParent();
            if (newParent) {
                if (nextIdea) {
                    // daca mai sunt idei dupa asta ca si copii ai parintelui
                    if (oldParent) {
                        oldParent.removeChild(this);
                    }
                    this.deleteHTML();
                    this.insert(oldParent.getIndexOfLastIdeaFromChildren());
                    // link idea to parent
                    this.setParent(newParent, oldParent);
                    app.editor.currentIdea = null;
                    app.editor.setCurrentIdea(this);
                    this.updateChildrenPosition();
                }
                this.setParent(newParent, oldParent);
            }
        }
    };
    ChildIdea = Idea.extend(ChildIdeaTemplate);
}());