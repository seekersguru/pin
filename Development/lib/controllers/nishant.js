'use strict';

var mongoose = require('mongoose'),
    Nishant = mongoose.model('Nishant'),
      _ = require('lodash');

exports.query = function(req, res){
    var q = Nishant.find({});
    

    
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
        for(var i=0; i<users.length; i++){
          users[i] = users[i].profile;
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
     fullname : req.body.name,
     // username : req.body.username,
     email: req.body.email,
     // password: req.body.password
     location:req.body.location
  };
  var newUser = new Nishant(data);
  newUser.provider = 'local';
  newUser.save(function(err, savedUser) {
    if (err) return res.json(400, err);
      return res.json({status:1});
  });
};

