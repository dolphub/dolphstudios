'use strict';
var jwt = require('express-jwt');

module.exports = jwt({
    secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
    silent: true,
    getToken: function(req) {
        var authHeaders = req.headers.authorization;
        if (authHeaders && authHeaders.split(' ')[0] === 'Bearer') {
            return authHeaders.split(' ')[1] || null;
        } else {
            return null;
        }
    }
});