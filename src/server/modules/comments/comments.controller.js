'use strict';
var logger = require('winston');
var util = require('util');
var mongoose = require('mongoose');
var Comments = mongoose.model('Comments');

module.exports.getComments = function (req, res) {
    Comments.find({}, function(err, comments) {
        if (err) {
            logger.error('Error retrieving comments from database', err);
            res.status(400).send({ error: err });
        } else {
            setTimeout(function() {
                res.json(comments);
            }, 2000);
        }
    }).sort({ date: -1 });
};

module.exports.addComment = function(req, res) {
    var comment = new Comments(req.body);
    comment.save(function(err) {
        if (err) {
            logger.error('Error inserting comment', req.body);
            res.status(400).send({ error: err});
        } else {
            res.json(comment);
        }
    });
}