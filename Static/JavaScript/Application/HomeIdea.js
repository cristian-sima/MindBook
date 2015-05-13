/*global app,Class,Idea,$*/
(function () {
    "use strict";
    var HomeIdeaTemplate = {
        init: function (id, content) {
            this._super(id, content);
        },
        updateLevel: function () {
            var i, child;
            this.level = 0;
            for (i = 0; i < this.children.length; i = i + 1) {
                child = this.children[i];
                child.updateLevel();
            }
        },
        isHome: function () {
            return true;
        }
    };
    HomeIdea = Idea.extend(HomeIdeaTemplate);
}());