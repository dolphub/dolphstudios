'use strict';
var chatController = require('./chat.controller');
var jwtCheck = require('./../../utils/middlewares/jwtCheck');

module.exports = function(app) {
    app.get('/api/chat',
        jwtCheck,
        chatController.getUsers);
};