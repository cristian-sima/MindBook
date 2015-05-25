/*global app,Class,Line,$,HomeLine*/
(function () {
    "use strict";
    var HomeLineTemplate = {
        // constructor
        init: function (idea, container) {
            this._super(idea, container);
        },
        insertElement: function (container) {
            var html = this.getHTML();
            $(container).html(html);
        },
        getHTML: function () {
            var id = this.idea.id,
                content = this.idea.getContent(),
                toReturn = '';

            function getOptions(id, parent) {
                if (parent) {
                    return '<img class="option-editor" src="Static/Images/Menu/list.svg" "Visual" id="Show Visual" data-id="' + id + '" >';
                }
                return "";
            }
            console.log(this.getIdea());
            toReturn += "<div id='element-" + id + "' class='idea-div idea-home'>";
            toReturn += content;
            toReturn += getOptions(id, this.getIdea().hasParent());
            toReturn += " </div>";
            return toReturn;
        },
        getElements: function () {
            var id = this.idea.id;
            this.element = $("#element-" + id);
        },
        insertHTMLElement: function (container) {
            var HTML = this.getContent();
            $(container).html(HTML);
        },
        getPreviousLine: function () {
            // empty
        }
    };
    HomeLine = Line.extend(HomeLineTemplate);
}($));