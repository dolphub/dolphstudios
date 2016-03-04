'use strict';
var fs = require('fs');

module.exports = {
    db: {
        uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/ds-app',
        options: {
            user: '',
            pass: ''
        },
        // Enable mongoose debug mode
        debug: process.env.MONGODB_DEBUG || false
    },
    httpsOptions: {
    	privateKey: fs.readFileSync("/etc/letsencrypt/live/play.dolphstudios.com/privkey.pem", "utf-8"),
    	certificate: fs.readFileSync("/etc/letsencrypt/live/play.dolphstudios.com/cert.pem", "utf-8")
    }
};