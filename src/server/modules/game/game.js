'use strict';
var config = require('./../config/config');
var logger = require('winston');


var Game = function(io) {
    logger.info('New Game initialized!');
    this.io = io;
    this.initConnection();
};

Game.prototype.initConnection = function() {
    if (this.io) {
        this.io.on('connection', function(socket) {
            logger.info('New connection!', socket.id);
        });
    }
};

module.exports = Game;