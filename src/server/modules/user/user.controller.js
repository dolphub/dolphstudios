'use strict';

module.exports.getUser = function (req, res) {
    console.log('HIT GET USER');
    res.json({ user: req.user });
};