/*global app,Class,Idea,$*/
(function () {
    "use strict";
    var HomeIdeaTemplate = {
        init: function (id, content) {
            this._super(id, content);
        },
        getHTML: function () {
            return "<div  id='element-" + this.id + "' class='idea-div idea-home'>" + this.content +" </div>";
        },
        getJQueryElements: function () {
            this.element = $("#element-" + this.id);
        },
        updateLevel: function () {
            var i, child;
            this.level = 0;
            for (i = 0; i < this.children.length; i = i + 1) {
                child = this.children[i];
                child.updateLevel();
            }
        },
        insertHTMLElement: function (container) {
            var HTML = this.getContent();
            $(container).html(HTML);
        }
    };
    HomeIdea = Idea.extend(HomeIdeaTemplate);
}());