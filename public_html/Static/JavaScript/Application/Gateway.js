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
        this.connection = io.connect();
    },
    handleEvents: function () {
        this.handleConnectionStarts();
        this.handleCommunication();
        this.handleDisconnect();
    },
    handleConnectionStarts: function () {
        this.connection.on('connect', function () {
            app.start();
        });
    },
    handleCommunication: function () {
        this.handleRequestEvents();
        this.handleResponseEvents();
    },
    handleRequestEvents: function () {
        // Nothing, because it is a cl
    },
    handleResponseEvents: function () {
        // TODO
    },
    handleDisconnect: function () {
        this.connection.on('disconnect', function () {
            app.fired_applicationIsDisconnected();
        });
    }
};