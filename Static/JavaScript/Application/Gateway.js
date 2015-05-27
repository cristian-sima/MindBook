/*global io, app*/

function Gateway() {
    this.connection = null;
}
;
Gateway.prototype = {
    start: function () {
        this.getInitData(function (data) {
            app.load(data);
        });
    },
    getHomeIdeaID: function (callback) {
        this.sendAjaxRequest({
            "action": "getHomeIdeaID"
        }, callback);
    },
    getInitData: function (callback) {
        this.sendAjaxRequest({
            "action": "init"
        }, callback);
    },
    getIdea: function (id, callback) {
        this.sendAjaxRequest({
            "action": "getIdea",
            "id": id
        }, callback);
    },
    getEntireIdea: function (id, callback) {
        this.sendAjaxRequest({
            "action": "getEntireIdea",
            "id": id
        }, callback);
    },
    createIdea: function (idea, callback) {
        this.sendAjaxRequest({
            "action": "createIdea",
            "parent": idea.parent,
            "content": idea.content,
            "id": idea.id
        }, callback);
    },
    changeIdeaContent: function (idea, callback) {
        this.sendAjaxRequest({
            "action": "changeIdeaContent",
            "content": idea.content,
            "id": idea.id
        }, callback);
    },
    updateIdea: function (idea, callback, requestId) {
        this.sendAjaxRequest({
            action: "updateIdea",
            content: idea.content,
            id: idea.id,
            parent: idea.parent,
            children: idea.children,
            requestId: requestId
        }, callback);
    },
    findIdeasByContent: function (term, callback) {
        this.sendAjaxRequest({
            "action": "findIdeas",
            "term": term
        }, callback);
    },
    removeIdea: function (idea, callback) {
        this.sendAjaxRequest({
            "action": "removeIdea",
            "id": idea.id
        }, callback, true, callback);
    },
    sendAjaxRequest: function (data, callback, notShowLoading) {

        app.gui.showLoading();

        var fired_requestDone = (function () {
            var c = callback,
                show = notShowLoading;
            return function (data) {

                app.gui.hideLoading();

                c(jQuery.parseJSON(data));
            };
        })();
        $.ajax({
            url: "api/",
            data: data,
            success: fired_requestDone,
            type: "POST"
        });
    }
};