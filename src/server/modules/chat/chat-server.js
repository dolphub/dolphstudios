'use strict';
var ioJwt = require('./../../utils/middlewares/socketioJwt');
var logger = require('winston');

var io;

module.exports = {
    start: socketServer,
    getUsers: getConnectedUsers
};

function socketServer(server) {
    // make sure we can only start the server once
    if (io) { 
        return;
    }
    io = require('socket.io').listen(server);
    
    // Secure socket with jwt token
    io.use(ioJwt);
    
    io.on('connection', function(socket) {
        logger.info('New User connected!', socket.decoded_token.name, socket.decoded_token.user_id );
        // Send self successfull connection message
        io.emit('chatconnection::success', { user: socket.decoded_token, users: getConnectedUsers() });
        
        socket.on('chat::message', function(data) { // Broadcast to everyone connected
            var messageObj = {
                avatar: socket.decoded_token.picture,
                user: (socket.decoded_token.name || socket.decoded_token.nickname),
                message: data.msg,
                date: new Date(new Date().toISOString())
            };
            io.emit('chat::message', messageObj);
            logger.debug('Message from: ', messageObj.user, ':', messageObj.message);
        });

        socket.on('disconnect', function() {
            io.emit('chat::disconnect', { user: socket.decoded_token, users: getConnectedUsers() });
            logger.info((socket.decoded_token.name || socket.decoded_token.nickname), 'disconnected');
        });
    });
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