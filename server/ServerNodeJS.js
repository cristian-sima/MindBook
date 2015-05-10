/*global exports*/
var socketio = require('socket.io'),
    io = {},
    home = {
        id: 1,
        content: "Home",
        children: []
    },
    ideaCounter = 1;
exports.listen = function (server) {
    io = socketio.listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', function (socket) {
        handleEvents(socket);
    });
};

function handleEvents(socket) {
    handleRequestHomeIdea(socket);
}

function handleRequestHomeIdea(socket) {
    socket.on("getHomeIdea", function (socket) {
       sendHomeIdea(socket); 
    });
}

function sendHomeIdea(socket) {
    socket.emit("", {
        id: this.home.id,
        content: this.home.content,
        children: this.home.children
    });
}