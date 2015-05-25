/*global app,Class,Idea,ChildLine,$*/
(function () {
    "use strict";
    ServerIdea = function ServerIdea(localIdea) {
        this.localIdea = localIdea;
        this.id = null;
    };
    ServerIdea.prototype = {
        isIdeaOnServer: function () {
            return (this.id !== null);
        },
        setId: function (id) {
            this.id = id;
        },
        getId: function () {
            return this.id;
        },
        getLocalId: function () {
            return this.localIdea.id;
        },
        getLocalIdea: function () {
            return this.localIdea;
        },
        update: function () {
            var idea = this.getLocalIdea(),
                editor = idea.getEditor(),
                content = idea.getContent(),
                parent = idea.getParent().getId(),
                id = this.getId();
            editor.updateIdeaOnServer(id, content, parent, idea);
        }
    };
}());