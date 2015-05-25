/*global app,Class,Idea,ChildLine,$*/
(function () {
    "use strict";
    ServerIdea = function ServerIdea(localIdea) {
        this.localIdea = localIdea;
        this.id = null;
        this.correlatedId = null;
    };
    ServerIdea.prototype = {
        isOnServer: function () {
            return (this.id !== null);
        },
        setId: function (id) {
            this.id = id;
        },
        getCorrelatedId: function () {
            return this.correlatedId;
        },
        setCorrelatedId: function (id) {
            
        },
        getId: function () {
            if (this.id) {
                return this.id;
            }
            return this.getLocalIdea().getId();
        },
        getLocalIdea: function () {
            return this.localIdea;
        },
        update: function () {
            var idea = this.getLocalIdea(),
                serverId = this.getId(),
                localParent = idea.getParent(),
                editor = idea.getEditor(),
                content = idea.getContent(),
                serverParentId = localParent.getServerIdea().getId();
            if (this.canIdeaBeUpdated()) {
                editor.updateIdeaOnServer(serverId, content, serverParentId, idea);
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