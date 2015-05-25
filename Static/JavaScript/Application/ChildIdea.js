/*global app,Class,Idea,ChildLine,$*/
(function () {
    "use strict";
    var ChildIdeaTemplate = {
        init: function (info, home) {
            this.home = home;
            this._super(info.id, info.content, info.server);
        },
        setParent: function (newParent) {
            if (this.getParent()) {
                this.getParent().fired_childRealeased();
            }
            this.parent = newParent;
            this.getParent().fired_childSelected();
        },
        setLine: function (elementBefore) {
            if (this.getLine()) {
                this.getLine().remove();
            }
            this.line = new ChildLine(this, elementBefore);
        },
        isHome: function () {
            return false;
        },
        getHome: function () {
            return this.home;
        },
        updateLevel: function () {
            var position, child;
            this.level = this.getParent().getLevel() + 1;
            for (position = 0; position < this.children.length; position = position + 1) {
                child = this.children[position];
                child.updateLevel();
            }
            this.updateLine();
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
        /* to check */
        removeIdeaAndSaveChildren: function () {
            var parent = this.getParent(),
                toBeSelected = parent.getChildBefore(this),
                previousIdea = toBeSelected,
                index = null,
                child = null,
                realChildren = this.children.copy(),
                position = 0;
            if (!toBeSelected) {
                // este prima sau nu mai sus mai sus
                if (parent === app.editor.home) {
                    if (realChildren[0]) {
                        previousIdea = this.getHome();
                        toBeSelected = realChildren[0];
                    } else {
                        previousIdea = toBeSelected = parent.getChildAfter(this);
                    }
                } else {
                    previousIdea = toBeSelected = parent;
                }
            } else {
                if (toBeSelected.isParent()) {
                    toBeSelected = toBeSelected.getLastPossibleChild();
                }
            }
            if (parent && previousIdea && previousIdea.id === app.editor.home.id && parent.id === app.editor.home.id) {
                previousIdea = null;
            }
            for (index = 0; index < realChildren.length; index = index + 1) {
                position = previousIdea.getPosition() + 1;
                child = realChildren[index];
                parent.addChildAtPosition(child, position);
                previousIdea = child;
            }
            app.editor.setCurrentIdea(toBeSelected);
            this.children = [];
            this.remove();
        },
        reduceLevel: function () {
            var oldParent = this.getParent(),
                nextIdea = oldParent.getChildAfter(this),
                position = null,
                grandParent = oldParent.getParent(),
                beforeIdea = null;
            if (grandParent) {
                position = oldParent.getPosition() + 1;
                if (nextIdea) {
                    beforeIdea = oldParent.getLastPossibleChild();
                    grandParent.addChildAtPosition(this, position);
                    this.setLine(beforeIdea.getLine());
                    this.getEditor().setCurrentIdea(this);
                    this.moveChildrenAfterParent();
                } else {
                    grandParent.addChildAtPosition(this, position);
                }
            }
        },
        moveChildrenAfterParent: function () {
            var itemBefore = this,
                position = null,
                child = null;
            for (position = 0; position < this.children.length; position = position + 1) {
                child = this.children[position];
                itemBefore = child.getParent().getChildBefore(child);
                if (!itemBefore) {
                    itemBefore = child.getParent();
                } else {
                    itemBefore = itemBefore.getLastPossibleChild();
                }
                child.setLine(itemBefore.getLine());
                itemBefore = child;
                child.moveChildrenAfterParent();
            }
            this.highLight();
        },
        highLight: function () {
            this.getLine().highLight();
        },
        /* Listeners */
        fired_childSelected: function () {
            if (this.getLine()) {
                this.getLine().boldText();
            }
        },
        fired_childRealeased: function () {
            if (this.getLine()) {
                this.getLine().unboldText();
            }
        },
        fired_tabKeyPressed: function () {
            var previousIdea = this.getParent().getChildBefore(this),
                position = null;
            if (previousIdea) {
                position = previousIdea.getNumberOfChildren();
                previousIdea.getLine().updateIdea();
                previousIdea.addChildAtPosition(this, position);
            }
            this.updateLine();
        },
        fired_shiftTabKeyPressed: function () {
            this.reduceLevel();
            this.updateLine();
        },
        updateOnServer: function () {            
            this.serverIdea.update();
        },
        isCorrelatedToServer: function () {
            return this.getServerIdea().isCorrelated();
        }
    };
    ChildIdea = Idea.extend(ChildIdeaTemplate);
}());