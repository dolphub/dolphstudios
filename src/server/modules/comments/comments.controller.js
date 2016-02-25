'use strict';
var logger = require('winston');
var util = require('util');
var mongoose = require('mongoose');
var Comments = mongoose.model('Comments');

/**
 * Retrieve paged comments from db.
 */
module.exports.getComments = function (req, res) {
    var maxCount = req.query.maxComments ? parseInt(req.query.maxComments) : 0;
    var skipCount = req.query.skipCount ? parseInt(req.query.skipCount) : 0;

    Comments.find({}, function(err, comments) {
        if (err) {
            logger.error('Error retrieving comments from database', err);
            res.status(400).send({ error: err });
        } else {
            setTimeout(function() {
                res.json(comments);
            }, 1500);
        }
    }).sort({ date: -1 }).skip(skipCount).limit(maxCount);
};

/**
 * Add a comment into the database.
 */
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