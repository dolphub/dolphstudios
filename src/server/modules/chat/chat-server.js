'use strict';
var ioJwt = require('./../../utils/middlewares/socketioJwt');
var logger = require('winston');

// Private socket.io variables
var io;

// Module Singleton Exposure
module.exports = {
    start: socketServer,
    getUsers: getConnectedUsers
};


/**
 * Instantiate the chat serer.
 * @param {Object} Http/Express Server.
 */
function socketServer(server) {
    // make sure we can only start the server once
    if (io) { 
        return; 
    }

    io = require('socket.io').listen(server);    
    io.use(ioJwt); 
    
    io.on('connection', function(socket) {
        logger.info('New User connected!', socket.decoded_token.name, socket.decoded_token.user_id );
        configureSocket(socket);
    });
}

/**
 * Private: Configure socket connection services per socket.
 * @param {Object}  Socket Objet.
 */
function configureSocket(socket) {
    io.emit('chatconnection::success', { user: socket.decoded_token, users: getConnectedUsers() });

    configureSocketMessages(socket);
    configureSocketDisconnect(socket);

    // TODO: Configure SocketChannel Rooms
}

/**
 * Configure Socket for chat messages.
 * @param {Object} Socket object.
 */
function configureSocketMessages(socket) {
    socket.on('chat::message', onChatMessage);
    function onChatMessage(data) {
        var messageObj = {
            avatar: socket.decoded_token.picture,
            user: (socket.decoded_token.name || socket.decoded_token.nickname),
            message: data.msg,
            date: new Date(new Date().toISOString())
        };
        io.emit('chat::message', messageObj);
        logger.debug('Message from: ', messageObj.user, ':', messageObj.message);
    };
}

/**
 * Handle the socket disconnection event.
 * @param {Object} Socket object.
 */
function configureSocketDisconnect(socket) {
    socket.on('disconnect', onDisconnect);

    function onDisconnect() {
        io.emit('chat::disconnect', { user: socket.decoded_token, users: getConnectedUsers() });
        logger.info((socket.decoded_token.name || socket.decoded_token.nickname), 'disconnected');
    };
}

/**
 * Get a list of all connected users to the chat server
 * When a user calls the get connected users, 
 */
function getConnectedUsers() {
    var connectedClients = io.sockets.clients().connected;
    var clients = [];
    Object.keys(connectedClients).forEach(function(id) {
        clients.push(connectedClients[id].decoded_token);
    });
    return clients;
}