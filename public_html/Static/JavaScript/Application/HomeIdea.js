/*global app,Class,Idea,$*/
(function () {
    "use strict";
    var HomeIdeaTemplate = {
        init: function () {
            this._super("Home");
        },
        getHTML: function () {
            return "<div  id='element-" + this.id + "' class='idea-div'></div>";
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
        }
    };
    HomeIdea = Idea.extend(HomeIdeaTemplate);
}());