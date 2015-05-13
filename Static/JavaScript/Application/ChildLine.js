/*global app,Class,Line,s,ChildLine,$*/
(function () {
    "use strict";
    var ChildLineTemplate = {
        // constructor
        init: function (idea, previousLine) {
            this._super(idea, previousLine);
            this.highlightTimeout = null;
        },
        insertElement: function (previousLine) {
            var HTML = this.getHTML();
            console.log(previousLine);
            $(HTML).insertAfter(previousLine.getElement());
        },
        getHTML: function () {
            var id = this.idea.id,
                content = this.idea.getContent(),
                nrOfChildren = this.idea.getNumberOfChildren();

            function getTextarea() {
                return "<textarea spellcheck='false' class='idea-textarea' id='textarea' data-id='" + id + "' >" + content + "</textarea>";
            }

            function getID() {
                return "<div class='idea-id' style='display:none' id='id'>" + id + " </div>";
            }

            function getNumberOfChildren() {
                return "<div class='numberOfChildren' id='childrennr'>" + nrOfChildren + "&nbsp;</div>";
            }
            var toReturn = "";
            toReturn += "<div id='element-" + id + "' class='idea-div'> ";
            toReturn += "<div class='warning' id='warning'>" + '<img src="Static/Images/warning.png" alt="Atentie" title="">' + "</div>";
            toReturn += "<div class='content' id='content'>";
            toReturn += getID();
            toReturn += getNumberOfChildren();
            toReturn += getTextarea();
            toReturn += "</div>";
            toReturn += "</div>";
            return toReturn;
        },
        activateListeners: function () {
            this.activateKeyListenes();
            this.activateMouseListeners();
        },
        getElements: function () {
            var id = this.idea.id;
            this.element = $("#element-" + id);
            this.textarea = this.getElement().children("#content").children("#textarea");
        },
        activateKeyListenes: function () {
            var idea = this.idea;
            this.textarea.on("keydown", function (event) {
                var keyCode = event.keyCode || event.which,
                    previousIdea;
                if (app.data.isSpecialKey(keyCode)) {
                    event.preventDefault();
                }
                switch (keyCode) {
                    case app.data.keys.ENTER.code:
                        var editor = idea.getEditor();
                        
                        // TODO
                        
                        
                        break;
                    case app.data.keys.TAB.code:
                        if (event.shiftKey) {
                            // <-----
                            idea.reduceLevel();
                        } else {
                            // -----> (TAB)
                            idea.fired_tabKey();
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
                var content = idea.textarea.val();
                idea.setContent(content);
                idea.update();
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
            this.getIdea().getParent().fired_childSelected();
        },
        deselect: function () {
            this.getIdea().getParent().fired_childRealeased();
        },
        boldText: function () {
            this.textarea.addClass("parent-focused");
        },
        unboldText: function () {
            this.textarea.removeClass("parent-focused");
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
        update: function () {
            updateHTML();
            updateWarning();
        },
        updateHTML: function () {
            var levelWidth = 30,
                level = this.idea.getLevel(),
                margin = levelWidth * level,
                numberOfChildren = this.idea.getNumberOfChildren();
            
            // update the level
            this.element.children("#content").css({
                marginLeft: margin + "px"
            });
            // check warnings
            this.element.children("#content").children("#childrennr").html(numberOfChildren);
        },
        updateWarning: function () {
            var content = this.idea.getContent();s
            if (content.length === 0) {
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
        }
    };
    ChildLine = Line.extend(ChildLineTemplate);
}($));