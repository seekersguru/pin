'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    InviteMe = mongoose.model('InviteMe'),
    passport = require('passport'),
    Email = require('../email').Email,
    Order = mongoose.model('Order'),
    ActivationEmail = require('../email').ActivationEmail,
    ForgotPasswordEmail = require('../email').ForgotPasswordEmail,
    _ = require('lodash');


exports.sales= function(req, res){
  var q = Order.find({});
  var user_id = req.params.id;
  var arr = [];   
  
  User.findById(user_id, function(err, user){

    for(var i = 0; i < user.artworks.length; i++){
        arr.push(String(user.artworks[i]));
    }
             
    q = q.where("status", "paid").
      where("cart").elemMatch({"artwork" : {
      $in: arr
    }});
    
    q.exec(function(err, orders) {
      if (err) {
        console.log(err);
        return res.send(404);
      } else {
        for(var i =0 ;i<orders.length; i++){
          orders[i] = orders[i].saleInfo;
            for(var j=0; j<orders[i].cart.length; j++){
              if(arr.indexOf(orders[i].cart[j].artwork) === -1){
                orders[i].cart.splice(j,1);
                j--;
              }
            }
          }
        }
        return res.json({orders:orders});
      });
      
    });
};

exports.getAllUsersWithSale = function(req, res){
  if(req.user.role !== 'admin'){
    return res.send(404);
  }else{
    var u = User.find({});
    var o = Order.find({});
    var length, iter=0;
    
    //u.populate('artworks', 'public');
    
    u.exec(function(err, users){
      if(err){
        console.log(err);
        return res.send(404);
      }else{
        length = users.length;
        var usersObj = {};
        usersObj.users = [];
        
        users.forEach(function(user){
            var arr = [];
            
            for(var i = 0; i < user.artworks.length; i++){
                arr.push(String(user.artworks[i]));
            }
        
            o = o.where("status", "paid").
              where("cart").elemMatch({"artwork" : {
              $in: arr
            }});
            
            o.exec(function(err, orders) {
              if (err) {
                console.log(err);
                return res.send(404);
              } else {
                for(var i =0 ;i<orders.length; i++){
                  orders[i] = orders[i].saleInfo;
                    for(var j=0; j<orders[i].cart.length; j++){
                      if(arr.indexOf(orders[i].cart[j].artwork) === -1){
                        orders[i].cart.splice(j,1);
                        j--;
                      }
                    }
                  }
                }
                
                var tmp = user.all;
                tmp.orders = orders;
                usersObj.users.push(tmp);
                iter++;
                if(iter >= length){
                  return res.send({users:usersObj});
                }
            });
            
            
            
        });  
      }
    });
  }
};

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
     username : req.body.username,
     email: req.body.email,
     password: req.body.password
  };
  var newUser = new User(data);
  newUser.provider = 'local';
  newUser.save(function(err, savedUser) {
    if (err) return res.json(400, err);
    var activation_link = [req.headers.host, 'user', savedUser._id,'verify',  savedUser.emailVerification.token].join('/');
    (new ActivationEmail(savedUser, {activationLink: activation_link})).send(function(e) {
      return res.send(savedUser.userInfo);
    });
  });
};
exports.inviteMe = function(req,res, next) {
  var invite =  new InviteMe({email: req.body.email, name: req.body.name});
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  invite.save(function (err, savedInvite) {
    if (err) return res.json(400, err);
    var email = new Email({
      to: 'contact@paintcollar.com',
      subject: 'Invite Request from ' + savedInvite.email,
      text: 'ID: ' + savedInvite._id + '\nEmail:' + savedInvite.email +'\nName:' + savedInvite.name  + '\nIP:' + ip
    }).send();
    return res.send(200);
  });
};
exports.resend = function (req, res, next) {
  var user_email = req.body.email;
  User.findOne({ $or : [{email:user_email}, {username:user_email}] }, 'name email emailVerification', function(err, user) {
    if (err) return res.send(400);
    if (!user) {
      return res.send(404);
    }
    if (user.emailVerification.verified) {
      return res.send(403, 'This account is already verified');
    }
    var send_verification = function(user) {
      var activation_link = [req.headers.host, 'user', user._id,'verify',  user.emailVerification.token].join('/');
      (new ActivationEmail(user, {activationLink: activation_link})).send(function(e) {
        if (e) return res.send(400);
        return res.send(200);
      });
    };
    if (user.emailVerification.token) {
      send_verification(user);
    } else {
      user.save(function(err, user) {
        if (err) return res.send(400);
        send_verification(user);
      });
    }
  });
};
exports.recover = function (req, res, next) {
  var userId = req.params.id;
  var token = req.body.token;
  var new_pass = req.body.newPassword;

  User.findById(userId, function(err, user) {
    if (err) throw err;
    if (!user || user.forgotPassword.token !== token) {
      return res.send(403, 'invalid');
    }
    if (user.forgotPassword.validTill < Date.now()) {
      return res.send(403, 'expired');
    }
    user.password = new_pass;
    user.forgotPassword.validTill = Date.now();
    user.save(function(err, user) {
      if (err) return res.send(400);
      return res.send(200);
    });
  });
};
exports.forgot = function (req, res, next) {
  var email = req.body.email;
  User.findOne({email: email}, function(err, user) {
    if (err) res.send(400);
    if (!user) {
      return res.send(404, 'This user does not exist');
    }
    user.setForgotPassword();
    user.save(function(err, user) {
      if (err) res.send(400);
      var forgot_link = [req.headers.host, 'user', user._id, 'recover',  user.forgotPassword.token].join('/');
      (new ForgotPasswordEmail(user, {forgotLink: forgot_link})).send(function(e) {
        return res.send(200);
      });
    });
  });
};
exports.verifyEmail = function (req, res, next) {
  var userId = req.params.id;
  var token = req.params.token;
  console.log('verifyEmail');
  User.findById(userId, function(err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);
    if (user.emailVerification.token === token) {
      user.emailVerification.verified = true;
      user.save(function(err) {
        req.logIn(user, function(err) {
          if (err) return res.send(err);
          return res.redirect('/settings');
        });
      });
    } else {
      return res.send(401, 'Invalid Token');
    }
  });
};
/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;
  var only_public = {public:true};
  var query = {};

  if(userId.length === 24){
    query._id = userId;
  }else{
    query.username = userId;
  }  

  if (req.user && ((req.user.username && query.username && req.user.username===query.username) || (query._id && req.user._id.equals(query._id)))) {
    only_public =  {};
  }
  
  User.findOne(query).populate('artworks', 'title mainImage merchs description public nFavorites category', only_public).exec(function (err, user) {
    if (err) return next(err);
    if (!user) return res.send({ profile: 0 });
    var profile = user.profile;
    if(user.showAge){
      profile.dob = user.dob;
    }
    res.send({ profile: profile });
  });
};

/**
 * Change password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.params.id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);
  if(!req.user._id.equals(userId)){
    return res.send(403);
  }
  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return res.send(400);

        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get current user
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};

/**
 * Follow and Unfollow Users
 */

exports.follow = function(req, res){
  var follower = req.user._id;
  var following = req.body.following;
  var action = req.params.action;

  if(action === "follow"){
      User.findByIdAndUpdateFollow(follower, following, function(err, user){
        res.send(200);
        if(err){
          res.send(404);
        }else{
          res.send(200);
        }
      });
  }else if(action === "unfollow"){
      User.findByIdAndUpdateUnfollow(follower, following, function(err, user){
        if(err){
          res.send(404);
        }else{
          res.send(200);
        }
      });
  }else{
    return res.send(404);
  }
};

/**
 * Add or Remove ArtWork to Favorite 
 */

exports.favorite = function(req, res){
  var userId = req.user._id;
  var artworkId = req.body.favorite;
  var action = req.params.action;
  
  
  if(action === "add"){
    User.findByIdAndAddFavorite(userId, artworkId, function(err, user){
      if(err){
        res.send(404);
      }else{
        res.send(200);
      }
    });
  }else if(action === "remove"){
    User.findByIdAndRemoveFavorite(userId, artworkId, function(err, user){
      if(err){
        res.send(404);
      }else{
        res.send(200);
      }
    });
  }else{
    return res.send(404);
  }
};

exports.update = function(req, res){
  var user_id = req.params.id;
  var user_data = req.body;
  delete user_data.role;
  delete user_data._id;
  

  
  if(user_data.username){
    user_data.username = user_data.username.toLowerCase();
    var blocked = ['shop', 'login', 'signup', 'forgot', 'cart', 'checkout', 'faq', 'print', 'privacy', 'designing', 'tnc', 'admin', 'settings'];
    
    if(user_data.username.length > 16 || user_data.username.length < 3 || blocked.indexOf(user_data.username) !== -1 || user_data.username.indexOf('/') !== -1 || user_data.username.indexOf(' ') !== -1 || user_data.username.indexOf('@') !== -1){
      return res.send(400);
    }
    User.findOne( { username : user_data.username }).exec(function(err, user){
        if(err){
          res.send(400);
        }
        
        if(user && user._id.toString() !== user_id){
          return res.send(404);
        }else{
          User.findOneAndUpdate({_id: user_id}, user_data, function(err, user) {
              if(err){
                res.send(400);
              }
              if (!user) res.send(404);
              res.send(200);
          });
        }
    });
  }else{
    console.log("inhere");
    User.findOneAndUpdate({_id: user_id}, user_data, function(err, user) {
        if(err){
          res.send(400);
        }
        if (!user) res.send(404);
        res.send(200);
    });
  }
};

