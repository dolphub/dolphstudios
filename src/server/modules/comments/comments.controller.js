'use strict';
var logger = require('winston');
var util = require('util');
var mongoose = require('mongoose');
var Comments = mongoose.model('Comments');

module.exports.getComments = function (req, res) {
    logger.info('/api/comments called');
    var test = [
        { user: req.user.name || req.user.nickname, avatar: req.user.picture, message: 'Where\'s the games noob?', date: new Date(new Date().toISOString()) },
        { user: req.user.name || req.user.nickname, avatar: req.user.picture, message: 'Wow this material design is pretty nifty!', date: new Date(new Date().toISOString()) },
        { user: req.user.name || req.user.nickname, avatar: req.user.picture, message: 'This site is awesome!', date: new Date(new Date().toISOString()) }
    ];

    // Comments.find({_id: 0}, function(err, docs) {
    //     if (err) {
            
    //     }
    // });
    res.json(test);
};

module.exports.addComment = function(req, res) {
    logger.info('ADDING COMMENT:', req.body);
    var comment = new Comments(req.body);
    comment.save(function(err) {
        if (err) {
            logger.error('Error inserting comment', req.body);
            res.status(400).send({ error: err});
        } else {
            logger.info('Comment inserted!')
            res.json(comment);
        }
    });
}