'use strict';

var mongoose = require('mongoose'),
User = mongoose.model('User'),
passport = require('passport'),
Email = require('../email').Email,
ActivationEmail = require('../email').ActivationEmail,
ForgotPasswordEmail = require('../email').ForgotPasswordEmail,
_ = require('lodash');


exports.query = function(req, res){
  var q = User.find({});
  if (req.query.array_foll){
    if(typeof req.query.array_foll === typeof {}){
      q = q.where('_id').in(req.query.array_foll);
    }
    else{
      q = q.where('_id', req.query.array_foll);
    }
  }else if(req.query.foll_limit){
    return res.json(404);
  }

  q.exec(function(err, users) {
    if (err) {
      console.log(err);
      return res.send(404);
    } else {
      if(req.user.role !== 'admin'){
        for(var i=0; i<users.length; i++){
          users[i] = users[i].profile;
        }
      }
      return res.json({users:users});
    }
  });
};

/** checkusername that it is exist or not */
exports.checkusername= function(req, res, next){
  var username = req.params.username
  var q = User.findOne({username: username},
   function(err,users) {
    if (err) {
      console.log(err);
      return res.send(404);
    } else {
      console.log(users);
      return res.json({users:users});
    }
  }); 
};

/**
 * Create user
 */
 exports.create = function (req, res, next) {
  var data = req.body;
  data.band='';
 var newUser = new User(data);
 newUser.provider = 'local';
 newUser.save(function(err, savedUser) {
 if (err) return res.json(400, err);
    // var activation_link = [req.headers.host, 'user', savedUser._id,'verify',  savedUser.emailVerification.token].join('/');
    // (new ActivationEmail(savedUser, {activationLink: activation_link})).send(function(e) {
    //   return res.send(savedUser.userInfo);
    // });
    return res.send(savedUser.userInfo);
});

};

