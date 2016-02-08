/* global __dirname */
/*jshint node:true*/
'use strict';

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}
require('dotenv').config()

var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var morgan = require('morgan');
var logger = require('winston');
var resolve = require('path').resolve;
var glob = require('glob');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var utils = require('./utils/utils');
var chat = require('./chat/chat-server');



if (process.env.NODE_ENV = 'development') {
    logger.level = 'debug';    
}

// Custom Middlewares
var jwtCheck = require('./utils/middlewares/jwtCheck');
var four0four = require('./utils/middlewares/404.js')();

app.use(express.static('./src/client/'));
app.use(express.static('./'));
app.use(bodyParser.urlencoded({ extended: true }));
    
// Glob Routes
utils.getGlobbedFiles(resolve(__dirname, './routes/**/*.js')).forEach(function(route) {
    require(resolve(route))(app, jwtCheck);
});

app.use('/app/*', function(req, res, next) {
    four0four.send404(req, res);
});
// Any deep link calls should return index.html
app.use('/*', express.static('./src/client/index.html')); 
app.use(morgan('combined'));

server.listen(port, function() {
    logger.info('\nExpress server listening on port ' + port);
    logger.info('env = ' + app.get('env'));
});

// Starts the chat server
chat.start(server);