/*global app,Class,Idea,ChildLine,$*/
(function () {
    "use strict";
    var ChildIdeaTemplate = {
        init: function (info, home) {
            this.home = home;
            this.updateBlocked = false;
            this._super(info.id, info.content, info.server);
        },
        blockUpdate: function () {
            this.updateBlocked = true;
        },
        isUpdateBlocked: function () {
            return this.updateBlocked;
        },
        setParent: function (newParent) {
            this.parent = newParent;
        },
        setLine: function (elementBefore) {
            if (this.getLine()) {
                this.getLine().remove();
            }
            this.line = new ChildLine(this, elementBefore);
        },
        getPosition: function () {
            return this.getParent().getPositionOfChild(this);
        },
        getTextLines: function () {
            var content = this.getContent(),
                matches = content.match(/\n/g),
                breaks = matches ? matches.length : 0;
            return breaks;
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
        select: function (cursorPosition, cursorPositionEnds) {
            var line = this.getLine(),
                parent = this.getParent();
            line.fired_selected(cursorPosition, cursorPositionEnds);
            parent.fired_childSelected();
        },
        deselect: function () {
            var line = this.getLine(),
                parent = this.getParent();
            line.fired_deselected();
            parent.fired_childRealeased();
        },
        /* to check */
        removeIdeaAndSaveChildren: function () {
            var parent = this.getParent(),
                toBeSelected = parent.getChildBefore(this),
                previousIdea = toBeSelected,
                index = null,
                child = null,
                realChildren = this.children.copy(),
                position = 0,
                editor = this.getEditor();
            if (!toBeSelected) {
                // este prima sau nu mai sus mai sus
                if (parent === editor.home) {
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
            for (index = 0; index < realChildren.length; index = index + 1) {
                position = previousIdea.getPosition() + 1;
                child = realChildren[index];
                parent.addChildAtPosition(child, position);
                previousIdea = child;
            }
            editor.setCurrentIdea(toBeSelected, "END");
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
            this.getLine().getTextarea().highlight();
        },
        isCorrelated: function () {
            return this.getServerIdea().isCorrelated();
        },
        getParent: function () {
            return this.parent;
        },
        update: function () {
            if (!this.isUpdateBlocked()) {
                var line = this.getLine(),
                    serverIdea = this.getServerIdea();
                line.removeUpdateDelay();
                serverIdea.update();
                this.updateLine();
            }
        },
        updateOnServer: function () {
            this.serverIdea.update();
        },
        /* Listeners */
        fired_childSelected: function () {
            this.getLine().fired_childSelected();
        },
        fired_childRealeased: function () {
            this.getLine().fired_childRealeased();
        },
        fired_tabKeyPressed: function () {
            var oldParent = this.getParent(),
                newParent = oldParent.getChildBefore(this),
                position = null;
            if (newParent) {
                position = newParent.getNumberOfChildren();
                newParent.addChildAtPosition(this, position);
                this.update();
                newParent.fired_childSelected();
                oldParent.fired_childRealeased();
            }
        },
        fired_shiftTabKeyPressed: function () {
            var oldParent = this.getParent(),
                newParent = oldParent.getParent();
            if (newParent) {
                this.reduceLevel();
                this.update();
                newParent.fired_childSelected();
                oldParent.fired_childRealeased();
            }
        }
    };
    ChildIdea = Idea.extend(ChildIdeaTemplate);
}());