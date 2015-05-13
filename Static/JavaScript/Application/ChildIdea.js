/*global app,Class,Idea,$*/
(function () {
    "use strict";
    var ChildIdeaTemplate = {
        init: function (id, content) {
            this._super(id, content);
        },
        updateLevel: function () {
            var margin = 0,
                i = null,
                child = null;
            this.level = this.getParent().level + 1;
      
          
            if (this.getParent().hasParent()) {
                this.getParent().updateHTML();
            }
            for (i = 0; i < this.children.length; i = i + 1) {
                child = this.children[i];
                child.updateLevel();
                child.getParent().updateHTML();
            }
            this.updateHTML();
        },
        setParent: function (parent, previousItem) {
            if (this.getParent()) {
                this.getParent().removeChild(this);
                if (this.getParent().getParent()) {
                    this.getParent().disableParent();
                }
                this.getParent().updateHTML();
            }
            this.parent = parent;
            this.parent.addChild(this, previousItem);
            this.parent.updateHTML();
            this.updateLevel();
            if (this.getParent().getParent()) {
                this.getParent().activateParent();
            }
        },
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
        },
        isHome: function () {
            return false;
        }
    };
    ChildIdea = Idea.extend(ChildIdeaTemplate);
}());