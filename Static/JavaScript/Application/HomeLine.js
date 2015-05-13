/*global app,Class,Line,$,HomeLine*/
(function () {
    "use strict";
    var HomeLineTemplate = {
        // constructor
        init: function (idea, parent) {
            this._super(idea, parent);
        },
        insertElement: function (element) {
            var html = this.getHTML();
            $(element).html(html);
        },
        getHTML: function () {
            var id = this.idea.id,
                content = this.idea.getContent();
            return "<div  id='element-" + id + "' class='idea-div idea-home'>" + content + " </div>";
        },
        getElements: function () {
            // empty
        },
        insertHTMLElement: function (container) {
            var HTML = this.getContent();
            $(container).html(HTML);
        }
    };
    HomeLine = Line.extend(HomeLineTemplate);
}($));