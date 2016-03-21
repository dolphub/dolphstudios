'use strict';
var logger = require('winston');
var chat = require('./chat-server');

/**
 * Retrieve paged comments from db.
 */
module.exports.getUsers = function (req, res) {
    res.json(chat.getUsers());
};