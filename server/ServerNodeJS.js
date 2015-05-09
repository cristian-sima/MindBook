var socketio = require('socket.io'),
    io = {},
    juke        = {},
    speaker     = null;
    
   
var server                  = {};
    server.devices          = {};
    server.deviceCounter    = 1;
        
    juke.volume                 = 0;
    juke.state                  = "mute";
    juke.isSpeakerConnected     = false;
    juke.isDeviceStreaming      = false;
    juke.streamingDevice        = null;
    
       

exports.listen = function (server) {
    io = socketio.listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', function (socket) {
        registerNewDevice(socket);    
        handleEvents(socket);
    });
};

function registerNewDevice(socket) {
    var name = 'WebClient ' + server.deviceCounter,
        id = socket.id;
    
    server.deviceCounter++;
    
    server.devices[id] = {
        name: name,
        type: "Client"
     };
        
    broadcastListOfCurrentDevices(socket);
}

function handleEvents(socket) {       
    handleClientEvents(socket);    
    handleJukeEvents(socket);
    
    
    
}

function handleClientEvents(socket){
	
    handleGetConnectedDevices(socket);
    handleGetCurrentState(socket);
    handleClientDisconnection(socket);
	
    handleTestEvent(socket);
    
    
    // requests
    handleRequestChangeVolume(socket);
}

/* *************** Client Events ************* */


// !!! temporary
function handleTestEvent(socket){
    socket.on('test', function (msg) {
        console.log("I got a test socket with this message: " + msg + ". I reply with an echo");
		socket.emit('testReply', "Hi! I am the server");
    });
}

function handleGetConnectedDevices(socket){
    socket.on('getConnectedDevices', function () {
        sendListOfCurrentDevices(socket);
    });
}

function handleGetCurrentState(socket) {
    socket.on('getCurrentState', function () {
        emitCurrentState(socket);
    });
}

function broadcastCurrentState(socket){
     socket.broadcast.emit('currentState', juke);
     emitCurrentState(socket);
}

function emitCurrentState(socket){
    socket.emit('currentState', juke);
}


function broadcastListOfCurrentDevices(socket){
    socket.broadcast.emit('currentDevices', server.devices);
    sendListOfCurrentDevices(socket);
}

function sendListOfCurrentDevices(socket){
    socket.emit('currentDevices', server.devices);
}


function handleClientDisconnection(socket) {
    socket.on('disconnect', function () {
        var id = socket.id;        
        delete server.devices[id];
        broadcastListOfCurrentDevices(socket);        
    });
}

function handleRequestChangeVolume(socket){
    socket.on('changeVolumeRequest', function () {
        // TODO 
        
        console.log("I got a socket");
    });
}


/* *************** Juke(Speaker) Events ************* */

function handleJukeEvents(socket){
    handleRegisterJukeEvent(socket);
}

function handleRegisterJukeEvent(socket){
    socket.on('registerJuke', function (data) {
		console.log('I got the registerJuke');
        registerJukeSpeaker(socket, data);
    });
}

function registerJukeSpeaker(socket, data){
    var id = socket.id;
    
	console.log("For registerJuke I got this from you");
	console.log(data);
	
    server.devices[id].type         = "Juke Speaker";
    
    juke.volume                     = data.volume;
    juke.state                      = data.state;
    juke.isSpeakerConnected         = true;
    juke.isDeviceStreaming          = data.isDeviceStreaming;
    juke.streamingDevice            = data.streamingDevice;
    
    broadcastCurrentState(socket);
    broadcastListOfCurrentDevices(socket);     
}



function broadcastVolumeLevel(socket){
     socket.broadcast.emit('volumeChanged', juke.volume);
     emitCurrentVolume(socket);
}

function emitCurrentVolume(socket){
    socket.emit('currentState', juke);
}