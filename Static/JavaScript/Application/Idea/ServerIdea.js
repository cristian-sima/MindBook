/*global app,Class,Idea,ChildLine,$*/
(function () {
    "use strict";
    ServerIdea = function ServerIdea(localIdea) {
        this.localIdea = localIdea;
        this.serverId = null;
        this.associationId = null;
    };
    ServerIdea.prototype = {
        isOnServer: function () {
            return (this.serverId !== null);
        },
        /**
         * It checks if the idea is on the server. If not, it addes it
         */
        setId: function (serverId) {
            this.serverId = serverId;
        },
        getAssociationId: function () {
            return this.associationId;
        },
        isAssociated: function () {
            return (this.associationId !== null);
        },
        associate: function (id) {
            this.changeAssociationId(id);
        },
        removeAssociation: function () {
            this.changeAssociationId(null); 
        },
        changeAssociationId: function (id) {   
            this.setId(id);
            this.associationId = id;
            this.localIdea.getLine().update();
        },
        getId: function () {
            if (this.serverId) {
                return this.serverId;
            }
            return this.getLocalIdea().getId();
        },
        getLocalIdea: function () {
            return this.localIdea;
        },
        update: function () {
            if (this.canIdeaBeUpdated()) {
                this.sync();
            }
        },
        forceUpdate: function () {
            if (!this.isOnServer()) {
                this.sync();
            }
        },
        sync: function () {
            var idea = this.getLocalIdea(),
                editor = idea.getEditor(),
                data = this.getSyncData();
            editor.updateIdeaOnServer(data, idea);
        },
        getSyncData: function () {
            var idea = this.getLocalIdea(),
                data = null;
            data = idea.getJSON();
            return data;
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