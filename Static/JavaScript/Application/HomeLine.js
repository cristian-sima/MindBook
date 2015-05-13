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
                content = this.idea.getContent();
            return "<div  id='element-" + id + "' class='idea-div idea-home'>" + content + " </div>";
        },
        getElements: function () {
            var id = this.idea.id;
            this.element = $("#element-" + id);
        },
        insertHTMLElement: function (container) {
            var HTML = this.getContent();
            $(container).html(HTML);
        }
    };
    HomeLine = Line.extend(HomeLineTemplate);
}($));