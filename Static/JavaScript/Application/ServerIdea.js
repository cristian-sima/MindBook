/*global app,Class,Idea,ChildLine,$*/
(function () {
    "use strict";
    ServerIdea = function ServerIdea(localIdea) {
        this.localIdea = localIdea;
        this.id = null;
    };
    ServerIdea.prototype = {
        isOnServer: function () {
            return (this.id !== null);
        },
        setId: function (id) {
            this.id = id;
        },
        getId: function () {
            return this.id;
        },
        getUpdateId: function () {
            if(this.id) {
                return this.id;
            }
            return this.getLocalIdea().getId();
        },
        getLocalIdea: function () {
            return this.localIdea;
        },
        update: function () {
            var idea = this.getLocalIdea(),
                editor = idea.getEditor(),
                content = idea.getContent(),
                parent = idea.getParent().getId(),
                id = this.getUpdateId();
            if (this.canIdeaBeUpdated()) {
                this.id = this.getLocalIdea().getId();
                editor.updateIdeaOnServer(id, content, parent, idea);
            }
        },
        canIdeaBeUpdated: function () {
            var idea = this.getLocalIdea(),
                content = idea.getContent();
            if (content.length !== 0) {
                return true;
            }
            if (this.isOnServer()) {
                return true;
            }
            if (idea.hasChildren()) {
                return true;
            }
            return false;
        }
    };
}());