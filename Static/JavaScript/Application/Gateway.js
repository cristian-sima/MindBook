/*global io, app*/

function Gateway() {
    this.connection = null;
};
Gateway.prototype = {
    init: function () {
        this.connectToServer();
        this.handleEvents();
    },
    connectToServer: function () {
        this.getHomeIdeaID(function (data) {
            app.setHomeIdeaID(data);
            app.start();
        });
    },
    handleEvents: function () {
        this.handleConnectionStarts();
        this.handleCommunication();
        this.handleDisconnect();
    },
    handleConnectionStarts: function () {},
    handleCommunication: function () {
        this.handleRequestEvents();
        this.handleResponseEvents();
    },
    handleRequestEvents: function () {
        // nothing
    },
    handleResponseEvents: function () {
        // TODO
    },
    handleDisconnect: function () {},
    getHomeIdeaID: function (callback) {
        $.ajax({
            data: {
                "url": "/api",
                "action": "getHomeIdeaID"
            },
            done: callback
        });
    }
};