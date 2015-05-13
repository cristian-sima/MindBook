/*global app,Class,Idea,$*/
(function () {
    "use strict";
    var HomeIdeaTemplate = {
        init: function (id, content, editor) {
            this.editor = editor;
            this._super(id, content);
        },
        isHome: function () {
            return true;
        },
        createLineElement: function (container) {            
            this.line = new HomeLine(this, container);
        },
        getHome: function () {
            return this;
        },
        getLevel: function () {
            return 1;
        },
        getEditor: function () {
            return this.editor;
        },       
        fired_childSelected: function () {
        },
        fired_childRealeased: function () {
        }
    };
    HomeIdea = Idea.extend(HomeIdeaTemplate);
}());