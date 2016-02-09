'use strict';
var userController = require('./user.controller');
var jwtCheck = require('./../../utils/middlewares/jwtCheck');

module.exports = function(app) {
    app.get('/api/user',
        jwtCheck,
        userController.getUser);
};