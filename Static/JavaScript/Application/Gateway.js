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
        
    },
    handleEvents: function () {
        this.handleConnectionStarts();
        this.handleCommunication();
        this.handleDisconnect();
    },
    handleConnectionStarts: function () {
       
    },
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
    handleDisconnect: function () {
    },
    getContentOfIdea: function (id, callback) {
    }
};