/*global app,Class,Idea,$*/
(function () {
    "use strict";
    var ChildIdeaTemplate = {
        init: function (id, content) {
            this._super(id, content);
        },
        getHTML: function () {
            function getTextarea(id, content) {
                return "<textarea spellcheck='false' class='idea-textarea' id='textarea' data-id='" + id + "' >" + content + "</textarea>";
            }

            function getID(id) {
                return "<div class='idea-id' style='display:none' id='id'>" + id + " </div>";
            }

            function getNumberOfChildren(nrOfChildren) {
                return "<div class='numberOfChildren' id='childrennr'>" + nrOfChildren + "&nbsp;</div>";
            }
            var toReturn = "";
            toReturn += "<div id='element-" + this.id + "' class='idea-div'> ";
            toReturn += "<div class='warning' id='warning'>" + '<img src="Static/Images/warning.png" alt="Atentie" title="">' + "</div>";
            toReturn += "<div class='content' id='content'>";
            toReturn += getID(this.id);
            toReturn += getNumberOfChildren(this.getNumberOfChildren());
            toReturn += getTextarea(this.id, this.getContent());
            toReturn += "</div>";
            toReturn += "</div>";
            return toReturn;
        },
        insertHTMLElement: function (previousIdea) {
            // pentru homeidea
            var HTML = this.getContent();
            if (!previousIdea) {
                $(this.parent.element).append(this.getContent());
            } else {
                $(HTML).insertAfter(previousIdea.element);
            }
        },
        getJQueryElements: function () {
            this.element = $("#element-" + this.id);
            this.textarea = this.element.children("#content").children("#textarea");
        },
        activateListeners: function () {
            this.activateKeyListenes();
            this.activateMouseListeners();
        },
        activateKeyListenes: function () {
            var idea = this;
            this.textarea.on("keydown", function (event) {
                var keyCode = event.keyCode || event.which,
                    previousIdea;
                if (app.data.isSpecialKey(keyCode)) {
                    event.preventDefault();
                }
                switch (keyCode) {
                    case app.data.keys.ENTER.code:
                        app.editor.createIdea(idea.getParent());
                        break;
                    case app.data.keys.TAB.code:
                        if (event.shiftKey) {
                            // <-----
                            idea.reduceLevel();
                        } else {
                            // -----> (TAB)
                            previousIdea = idea.getParent().getPreviousChild(idea);
                            if (previousIdea) {
                                idea.setParent(previousIdea, idea);
                            }
                        }
                        break;
                    case app.data.keys.BACKSPACE.code:
                        app.editor.removeIdea(idea, event);
                        break;
                    case app.data.keys["ARROW-UP"].code:
                        app.editor.moveUp();
                        break;
                    case app.data.keys["ARROW-DOWN"].code:
                        app.editor.moveDown();
                        break;
                }
            });
            this.textarea.on("keyup", function () {
                idea.setContent(idea.textarea.val());
                idea.updateHTML();
            });
        },
        activateMouseListeners: function () {
            var idea = this;
            this.textarea.on("click", function () {
                app.editor.setCurrentIdea(idea);
            });
            this.element.on("click", function () {
                app.editor.setCurrentIdea(idea);
            });
        },
        select: function () {
            this.textarea.focusToEnd();
            if (this.parent.parent) {
                this.parent.activateParent();
            }
        },
        deselect: function () {
            if (this.parent.parent) {
                this.parent.disableParent();
            }
        },
        activateParent: function () {
            this.textarea.addClass("parent-focused");
        },
        disableParent: function () {
            this.textarea.removeClass("parent-focused");
        },
        updateLevel: function () {
            var margin = 0,
                i = null,
                child = null;
            this.level = this.getParent().level + 1;
            margin = this.level * 30;
            this.element.children("#content").css({
                marginLeft: margin + "px"
            });
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
        updateHTML: function () {
            var nr = this.children.length;
            //  if (nr === 0) {
            nr = "";
            // }
            this.element.children("#content").children("#childrennr").html(nr);
            if (this.isParent() && this.getContent().length === 0) {
                this.showWarning("Randul este parinte si nu contine nimic");
            } else {
                this.hideWarning();
            }
        },
        showWarning: function (message) {
            var atentie = this.element.children("#warning");
            atentie.html('<img src="Static/Images/warning.png" alt="Atentie" title="' + message + '">');
        },
        hideWarning: function () {
            var atentie = this.element.children("#warning");
            atentie.html('');
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
        deleteHTML: function () {
            this.element.remove();
            this.textarea.off();
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
        highLight: function () {
            clearTimeout(this.highlightTimeout);
            var element = this.textarea,
                oldColor = element.css("background"),
                x = 400;
            element.css({
                "background": "rgb(255, 253, 70)"
            });
            this.highlightTimeout = setTimeout(function () {
                element.css({
                    "background": oldColor
                });
            }, x);
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