/*global app,Class,Idea,HomeLine*/
(function () {
    "use strict";
    var HomeIdeaTemplate = {
        init: function (id, content, editor) {
            this.editor = editor;
            this._super(id, content);
            this.createLineElement();
        },
        isHome: function () {
            return true;
        },
        createLineElement: function () {
            var element = this.getEditor().getContainer();
            this.line = new HomeLine(this, element);
        },
        getHome: function () {
            return this;
        },
        getLevel: function () {
            return 0;
        },
        getEditor: function () {
            return this.editor;
        }
    };
    HomeIdea = Idea.extend(HomeIdeaTemplate);
}());