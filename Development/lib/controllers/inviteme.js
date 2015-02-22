'use strict';

var mongoose = require('mongoose'),
    InviteMe = mongoose.model('InviteMe'),
    InviteFriendsEmail= require('../email').InviteFriendsEmail;

/**
 * Add query to database
 */

exports.inviteFriends = function (req, res) {
   var invite;
    invite = new InviteMe(req.body);
    invite.save(function (err) {
        if (!err) {
            (new InviteFriendsEmail({invitefriend: invite})).send(console.log);
            return res.send(invite);
        } else {
            return res.send(400);
        }
    });
};
