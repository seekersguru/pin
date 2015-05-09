'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('Serviceuser'),
    passport = require('passport'),
    config = require('../config/config'),
    qs = require('querystring');

/**
 * Logout
 */
exports.logout = function (req, res) {
  req.logout();
  res.send(200);
};

/**
 * Login
 */
exports.login = function (req, res, next) {
  var stratergy = 'local';
  passport.authenticate(stratergy ,function(err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);    
    req.logIn(user, function(err) {
      
      if (err) return res.send(err);
      res.json(req.user.userInfo);
    });
  
  })(req, res, next);
};

exports.fblogin = function(req, res, next) {
  var redirectPath = req.query.redirectPath || '/';
  redirectPath = (new Buffer(String(redirectPath))).toString('base64');
  passport.authenticate('facebook', {
    callbackURL : '/api/session/facebook/callback/?redirectPath='+ qs.escape(redirectPath),
    scope: ['email', 'public_profile', 'user_friends']
  })(req, res, next);
};

exports.fbcallback = function (req, res, next) {
  var redirectPath = req.query.redirectPath || '/';
  var redirectTo = (new Buffer(String(redirectPath), 'base64')).toString('ascii');
  console.log('redirectTo:', redirectTo);
  passport.authenticate('facebook', {
    callbackURL : '/api/session/facebook/callback/?redirectPath=' + qs.escape(redirectPath),
    failureRedirect: '/login/',
    successRedirect: redirectTo
  })(req, res, next);
};

exports.linkedinlogin = function(req, res, next) {
  var redirectPath = req.query.redirectPath || '/';
  redirectPath = (new Buffer(String(redirectPath))).toString('base64');
  passport.authenticate('linkedin', {
    callbackURL : '/api/session/linkedin/callback/?redirectPath='+ qs.escape(redirectPath),
    scope: ['r_basicprofile', 'r_emailaddress','r_fullprofile','r_contactinfo']
  })(req, res, next);
};

exports.linkedincallback = function (req, res, next) {
  var redirectPath = req.query.redirectPath || '/';
  var redirectTo = (new Buffer(String(redirectPath), 'base64')).toString('ascii');
  console.log('redirectTo:', redirectTo);
  passport.authenticate('linkedin', {
    callbackURL : '/api/session/linkedin/callback/?redirectPath=' + qs.escape(redirectPath),
    failureRedirect: '/login/',
    successRedirect: redirectTo
  })(req, res, next);
};
