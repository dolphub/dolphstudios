'use strict';
var socketioJwt = require('socketio-jwt');

module.exports = socketioJwt.authorize({
    secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
    handshake: true
});