'use strict';
var ioJwt = require('./../../utils/middlewares/socketioJwt');
var logger = require('winston');
module.exports = {
    start: socketServer
};

function socketServer(server) {
    var io = require('socket.io').listen(server);
    
    // Secure socket with jwt token
    io.use(ioJwt);
    
    io.on('connection', function(socket) {
        logger.info('New User connected!', socket.decoded_token.name, socket.decoded_token.user_id );
        // Send self successfull connection message
        io.emit('chatconnection::success', { user: socket.decoded_token });
        
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
            io.emit('chat::disconnect', { user: socket.decoded_token });
            logger.info((socket.decoded_token.name || socket.decoded_token.nickname), 'disconnected');
        });
    });
}