/*global io, app*/

function Gateway() {
    this.connection = null;
};
Gateway.prototype = {
    start: function () {
        this.getInitData(function (data) {
            app.load(data);
        });
    },
    getHomeIdeaID: function (callback) {
        this.sendAjaxRequest({
            action: "getHomeIdeaID"
        }, callback);
    },
    getInitData: function (callback) {
        this.sendAjaxRequest({
            action: "init"
        }, callback);
    },
    getEntireIdea: function (id, callback) {
        this.getIdea({
            id: id,
            level: "ALL"
        }, callback);
    },
    getIdea: function (idea, callback, error) {
        this.sendAjaxRequest({
            action: "getIdea",
            id: idea.id,
            level: idea.level
        }, callback, error);
    },
    createIdea: function (idea, callback, error) {
        this.sendAjaxRequest({
            action: "createIdea",
            "parent": idea.parent,
            "content": idea.content,
            "id": idea.id
        }, callback, error);
    },
    changeIdeaContent: function (idea, callback) {
        this.sendAjaxRequest({
            "action": "changeIdeaContent",
            "content": idea.content,
            "id": idea.id
        }, callback);
    },
    updateIdea: function (idea, requestId, callback, errorCallback) {
        this.sendAjaxRequest({
            action: "updateIdea",
            content: idea.content,
            id: idea.id,
            parent: idea.parent,
            children: idea.children,
            requestId: requestId
        }, callback, errorCallback);
    },
    findIdeasByContent: function (term, callback) {
        this.sendAjaxRequest({
            action: findIdeas,
            term: term
        }, callback);
    },
    removeIdea: function (idea, requestId, callback, error) {
        this.sendAjaxRequest({
            action: "removeIdea",
            id: idea.id,
            children: idea.children,
            requestId: requestId
        }, callback, error);
    },
    sendAjaxRequest: function (data, callback, error) {
        app.gui.showLoading();
        var fired_requestDone = function (cal, t) {
                var c = cal,
                    type = t;
                return function (data) {
                    app.gui.hideLoading();
                    if (type === "done") {
                        c(jQuery.parseJSON(data));
                    } else {
                        c();
                    }
                };
            };
        $.ajax({
            url: "api/",
            data: data,
            success: fired_requestDone(callback, "done"),
            type: "POST",
            error: fired_requestDone(error, "error")
        });
    },
    connectionLost: function () {
        $("#connection-lost").dialog({
            modal: true,
            dialogClass: 'no-close',
            closeOnEscape: false
        });
    }
};