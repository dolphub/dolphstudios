/* global __dirname */
/*jshint node:true*/
'use strict';

require('dotenv').config();

var config = require('./utils/config');
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
var chat = require('./modules/chat/chat-server');

var mongoose = require('./utils/mongoose');

var isProduction = process.env.NODE_ENV == 'production';
if (!isProduction) {
    logger.level = 'debug';
}

mongoose.loadModels();

mongoose.connect(function(db) {
    logger.info('Connected to mongo successfully!');
});

// Custom Middlewares
var jwtCheck = require('./utils/middlewares/jwtCheck');
var four0four = require('./utils/middlewares/404.js')();


if (isProduction) {
    app.use(express.static('./.tmp/'));
    app.use(express.static('./dist/'));
    app.use(express.static('./dist/lib/'));
} else {
    app.use(express.static('./.tmp/'));
    app.use(express.static('./src/client/'));
    app.use(express.static('./bower_components/'));     
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
    
// Glob Routes
utils.getGlobbedFiles(resolve(__dirname, './modules/**/*.routes.js')).forEach(function(route) {
    require(resolve(route))(app, jwtCheck);
});

app.use('/app/*', function(req, res, next) {
    four0four.send404(req, res);
});

// Any deep link calls should return index.html
app.use('/*', express.static('./src/client/index.html'));
app.use(morgan('combined'));


server.listen(process.env.PORT, function() {
    logger.info('Express server listening on port ' + process.env.PORT);
    logger.info('env = ' + app.get('env'));
});

// Starts the chat server
chat.start(server);