/*global app,Class,Idea,HomeLine*/
(function () {
    "use strict";
    var HomeIdeaTemplate = {
        init: function (info, editor) {
            var id = info.id,
                content = info.content,
                serverId = info.id, 
                parent = info.parent;
            
            this.editor = editor;
            this._super(id, content, serverId);
            this.parentId = parent;
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
        },
        updateOnServer: function () {
            // empty
        },
        getParentId: function () {
            return this.parentId;
        },
        isTheHomeRoot: function () {
            return (!this.getParentId());
        }
    };
    HomeIdea = Idea.extend(HomeIdeaTemplate);
}());