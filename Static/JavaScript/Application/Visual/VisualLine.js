/* global Visual,app,$,VisualIdea,Data*/
'use strict';
VisualLine = function VisualLine(data) {
    this.indentationChar = "\t";
    this.data = data;
};
VisualLine.prototype = {
    getLines: function (indentationChar) {
        if (indentationChar) {
            this.indentationChar = indentationChar;
        }
        return this.getContentAtLevel(this.data, 0);
    },
    getContentAtLevel: function (data, level) {
        var toReturn = "",
            children = data.children,
            iterator = 0,
            child = null;
        toReturn += this.getIndentation(level);
        toReturn += this.getContent(data, level);
        toReturn += this.getBreakingLine();
        if (children.length !== 0) {
            for (iterator = 0; iterator < children.length; iterator = iterator + 1) {
                child = children[iterator];
                toReturn += this.getContentAtLevel(child, level + 1);
            }
        }
        return toReturn;
    },
    getContent: function (data, level) {
        var content = data.content;
        content = content.replace(/(?:\r\n|\r|\n)/g, '\n' + this.getIndentation(level));
            content = (content.length === 0) ? "Empty" : content;
        return content;
    },
    getIndentation: function (level) {
        var iterator = 0,
            toReturn = "",
            character = this.indentationChar;
        for (iterator = 0; iterator < level; iterator = iterator + 1) {
            toReturn += character;
        }
        return toReturn;
    },
    getBreakingLine: function () {
        return "\n";
    }
};