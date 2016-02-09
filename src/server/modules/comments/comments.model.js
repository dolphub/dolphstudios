'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Comments Schema
 */

var CommentsSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    message: {
        type: String,
        default: '',
        trim: true
    },
    avatar: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: String,
        default: '',
        trim: true
    }
});

mongoose.model('Comments', CommentsSchema);