'use strict';
var commentsController = require('./comments.controller');
var jwtCheck = require('./../../utils/middlewares/jwtCheck');

module.exports = function(app) {
    app.get('/api/comments',
        jwtCheck,
        commentsController.getComments);

    app.post('/api/comments', 
        jwtCheck,
        commentsController.addComment);
};