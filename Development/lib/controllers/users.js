'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport'),
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
    
    if(req.user.role === 'admin'){
      q.populate('artworks', 'public mainImage');
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
/**
 * Create user
 */
exports.create = function (req, res, next) {
  var data = {
     name : req.body.name,
     // username : req.body.username,
     email: req.body.email,
     // password: req.body.password
  };
  var newUser = new User(data);
  newUser.provider = 'local';
  newUser.save(function(err, savedUser) {
    if (err) return res.json(400, err);
  
      return res.send(savedUser.userInfo);
  
  });
};

