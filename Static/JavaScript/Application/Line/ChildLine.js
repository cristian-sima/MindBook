/*global app,Class,Line,s,ChildLine,$*/
(function () {
    "use strict";
    var ChildLineTemplate = {
        // constructor
        init: function (idea, previousLine) {
            this._super(idea, previousLine);
            this.highlightTimeout = null;
            this.delayUpdateIdea = null;
            this.selected = false;
        },
        insertElement: function (previousLine) {
            var HTML = this.getHTML();
            $(HTML).insertAfter(previousLine.getElement());
        },
        getHTML: function () {
            var id = this.idea.id,
                content = this.idea.getContent(),
                nrOfChildren = this.idea.getNumberOfChildren(),
                toReturn = "";

            function getTextarea() {
                return "<textarea spellcheck='false' class='idea-textarea' id='textarea' data-id='" + id + "' >" + content + "</textarea>";
            }

            function getID() {
                return "<div class='idea-id' style='display:none' id='id'>" + id + " </div>";
            }

            function getNumberOfChildren() {
                return "<div class='numberOfChildren' style='display:none' id='childrennr'>" + nrOfChildren + "&nbsp;</div>";
            }
            toReturn += "<div id='element-" + id + "' class='idea-div'> ";
            toReturn += "<div class='warning' id='warning'></div>";
            // toReturn += "<div class='problem' id='problem'></div>";
            toReturn += "<div class='content' id='content'>";
            toReturn += getID();
            toReturn += getNumberOfChildren();
            toReturn += getTextarea();
            toReturn += "</div>";
            toReturn += "</div>";
            return toReturn;
        },
        activateListeners: function () {
            this.textarea.activateListeners();
        },
        getElements: function () {
            this._super();
            this.textarea = new Textarea(this);
        },
        delayUpdate: function () {
            var idea = this.getIdea(),
                editor = idea.getEditor();
            this.removeUpdateDelay();
            editor.addIdeaToWaitingList(idea);
            this.updateDelay = setTimeout(function () {
                idea.update();
            }, 500);
        },
        removeUpdateDelay: function () {
            var idea = this.getIdea(),
                editor = idea.getEditor();
            clearTimeout(this.updateDelay);
            editor.removeFromWaitingList(idea);
        },
        update: function () {
            this.updateHTML();
            this.updateWarning();
            this.getTextarea().update();
        },
        updateHTML: function () {
            var levelWidth = 25,
                level = parseInt(this.idea.getLevel(), 10) - 1,
                margin = levelWidth * level,
                numberOfChildren = this.idea.getNumberOfChildren();
            // update the level
            this.element.children("#content").css({
                marginLeft: margin + "px"
            });
            // update children number
            this.element.children("#content").children("#childrennr").html(numberOfChildren);
        },
        updateWarning: function () {
            var idea = this.getIdea(),
                content = idea.getContent();
            if (idea.isParent() && content.length === 0) {
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
        showProblem: function (message) {
            var problem = this.element.children("#problem");
            problem.html('<img src="Static/Images/problem.png" alt="Atentie" title="' + message + '">');
        },
        hideProblem: function () {
            var problem = this.element.children("#problem");
            problem.html('');
        },
        getTextarea: function () {
            return this.textarea;
        },
        isSelected: function () {
            return this.isSelected;
        },
        remove: function () {
            this.getTextarea().remove();
            this._super();
            this.removeUpdateDelay();
        },
        fired_selected: function (startPosition, endPosition) {
            this.selected = true;
            if (this.getTextarea()) {
                this.getTextarea().select(startPosition, endPosition);
            }
        },
        fired_deselected: function () {
            this.selected = false;
            this.getTextarea().deselect();
        },
        fired_childSelected: function () {
            this.getTextarea().boldText();
        },
        fired_childRealeased: function () {
            this.getTextarea().unboldText();
        }
    };
    ChildLine = Line.extend(ChildLineTemplate);
}($));