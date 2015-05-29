/*global Data, app*/

function Textarea(line) {
    this.line = line;
    this.element = line.getElement().children("#content").children("#textarea");
    this.shadow = new Shadow(this);
    this.highlightTimeout = null;
    this.cursorPosition = null;
};
Textarea.prototype = {
    update: function () {
        var line = this.getLine();
        this.updateHeight();
        this.updateCorrelation();
        if (line.isSelected()) {
            this.shadow.update();
        }
    },
    updateHeight: function () {
        var breaks = this.getIdea().getTextLines(),
            height = (breaks + 1) * 24;
        this.element.css({
            'height': height + "px"
        });
    },
    updateCorrelation: function () {
        var idea = this.getIdea();
        if (idea.isCorrelatedToServer()) {
            this.element.css({
                color: "rgb(87, 237, 87)"
            });
        } else {
            this.element.css({
                color: "black"
            });
        }
    },
    insertBreakingLine: function () {
        var line = this.getLine(),
            idea = line.getIdea(),
            position = this.element.prop("selectionStart"),
            newText = idea.getContent().insertAt(position, "\n");
        this.element.val(newText);
        this.setCursor(position + 1, position + 1);
    },
    getCursorPosition: function () {
        return this.element.prop("selectionStart");
    },
    getLine: function () {
        return this.line;
    },
    getIdea: function () {
        return this.line.getIdea();
    },
    getElement: function () {
        return this.element;
    },
    activateListeners: function () {
        this.activateKeyListeners();
        this.activateMouseListeners();
    },
    activateKeyListeners: function () {
        var idea = this.getIdea(),
            editor = idea.getEditor();
        this.element.on("keydown", function (event) {
            var keyCode = event.keyCode || event.which;
            if (app.data.isSpecialKey(keyCode)) {
                event.preventDefault();
            }
            switch (keyCode) {
                case app.data.keys.ENTER.code:
                    if (event.shiftKey) {
                        var textarea = idea.getLine().getTextarea();
                        textarea.insertBreakingLine();
                    } else {
                        editor.fired_enterKeyPressed(idea);
                    }
                    idea.update();
                    break;
                case app.data.keys.TAB.code:
                    if (event.shiftKey) {
                        idea.fired_shiftTabKeyPressed();
                    } else {
                        idea.fired_tabKeyPressed();
                    }
                    break;
                case app.data.keys.BACKSPACE.code:
                    editor.removeIdea(idea, event);
                    break;
            }
        });
        this.element.on("keyup", function (event) {
            var line = idea.getLine(),
                textarea = line.getTextarea(),
                content = textarea.element.val(),
                keyCode = event.keyCode || event.which,
                currentPosition = textarea.getCursorPosition();
            idea.setContent(content);
            idea.updateLine();
            // check the keys
            switch (keyCode) {
                case app.data.keys["ARROW-UP"].code:
                    if (currentPosition === 0) {
                        editor.moveUp();
                        return false;
                    }
                    break;
                case app.data.keys["ARROW-DOWN"].code:
                    if (currentPosition === (idea.getContent().length)) {
                        editor.moveDown();
                        return false;
                    }
                    break;
            }
            if (app.data.isModyfingKey(keyCode)) {
                line.delayUpdate();
            }
        });
    },
    activateMouseListeners: function () {
        var idea = this.getIdea(),
            editor = idea.getEditor();
        this.element.on("click", function () {
            var textarea = idea.getLine().getTextarea().element;
            editor.setCurrentIdea(idea, textarea.prop("selectionStart"), textarea.prop("selectionEnd"));
        });
    },
    remove: function () {
        this.element.remove();
    },
    boldText: function () {
        this.element.addClass("parent-focused");
    },
    unboldText: function () {
        this.element.removeClass("parent-focused");
    },
    highlight: function () {
        clearTimeout(this.highlightTimeout);
        var element = this.element,
            oldColor = element.css("background");
        element.css({
            "background": "rgb(255, 253, 70)"
        });
        this.highlightTimeout = setTimeout(function () {
            element.css({
                "background": oldColor
            });
        }, 400);
    },
    setCursor: function (start, end) {
        setCaretToPos(this.element[0], start, end);
    },
    select: function (startPosition, endPosition) {
        if (!startPosition) {
            startPosition = this.element.prop("selectionStart");
        }
        if (!endPosition) {
            endPosition = startPosition;
        }
        this.setCursor(startPosition, endPosition);
        this.shadow.update();
    },
    deselect: function () {
        this.shadow.hide();
    }
};
var Shadow = function Shadow(textarea) {
        this.textarea = textarea;
        this.element = textarea.getElement();
    };
Shadow.prototype = {
    show: function () {
        this.element.addClass("current-textarea");
    },
    hide: function () {
        this.element.removeClass("current-textarea");
    },
    update: function () {
        var breaks = this.textarea.getIdea().getTextLines();
        if (breaks > 0) {
            this.show();
        } else {
            this.hide();
        }
    }
};