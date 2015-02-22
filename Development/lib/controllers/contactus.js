'use strict';

var mongoose = require('mongoose'),
    ContactUs = mongoose.model('ContactUs'),
    ContactUsEmail = require('../email').ContactUsEmail;
/**
 * Add query to database
 */
exports.addQuery = function (req, res) {
    var contact;
    contact = new ContactUs(req.body);
    contact.save(function (err) {
        if (!err) {
            (new ContactUsEmail({contactus: contact})).send(console.log);
            return res.send(contact);
        } else {
            return res.send(400);
        }
    });

};
