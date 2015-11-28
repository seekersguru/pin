'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('Serviceuser'),
  passport = require('passport'),
  Email = require('../email').Email,
  ActivationEmail = require('../email').ActivationEmail,
  ForgotPasswordEmail = require('../email').ForgotPasswordEmail,
  AdminApproveEmail = require('../email').AdminApproveEmail,
  AdminBlockEmail = require('../email').AdminBlockEmail,
  multipart = require('connect-multiparty'),
  fs = require('fs'),
  path = require('path'),
  Company = mongoose.model('Company'),
  _ = require('lodash');


exports.query = function(req, res) {
  var q = User.find({
    role: {
      '$ne': 'admin'
    }
  }).populate('company', 'roletype');
  if (req.query.array_foll) {
    if (typeof req.query.array_foll === typeof {}) {
      q = q.where('_id').in(req.query.array_foll);
    } else {
      q = q.where('_id', req.query.array_foll);
    }
  } else if (req.query.foll_limit) {
    return res.json(404);
  }

  q.exec(function(err, users) {
    if (err) {
      console.log(err);
      return res.send(404);
    } else {
      // if(req.user.role !== 'admin'){
      for (var i = 0; i < users.length; i++) {
        users[i] = users[i].profile;
      }
      // }
      return res.json({
        users: users
      });
    }
  });
};

// show particluar one user 
exports.show = function(req, res) {
  var userid = req.params.userid;
  User.findById(userid).populate('author', 'name email')
    .exec(function(err, user) {
      if (err) {
        console.log(err);
        return res.json(404, err);
      }
      if (!user) {
        console.log('notfound');
        return res.send(404);
      }
      if (user) {
        return res.json(user);
      }
      return res.send(403);

    });

};

/** checkusername that it is exist or not */
exports.checkusername = function(req, res, next) {
  var username = req.params.username;
  var q = User.findOne({
      username: username
    },
    function(err, users) {
      if (err) {
        console.log(err);
        return res.send(404);
      } else {
        console.log(users);
        return res.json({
          users: users
        });
      }
    });
};

/** checkusername that it is exist or not */
exports.search = function(req, res) {
  var username = req.params.username;
  var regex = new RegExp(username, 'i'); // 'i' makes it case insensitive
  var q = User.find({
    name: regex
  });

  q.where('status').equals(true);
  q.where('searchable').equals(true);

  q.exec(function(err, users) {
    if (err) {
      console.log(err);
      return res.send(404);
    } else {
      for (var i = 0; i < users.length; i++) {
        users[i] = users[i].userInfo;
      }
      return res.json({
        users: users
      });
    }
  });
};

/** checkusername that it is exist or not */
exports.connect = function(req, res) {
  var user_id = req.params.userid;
  User.findByIdAndUpdate(
    user_id, {
      $push: {
        "following": req.body
      }
    }, {
      safe: true,
      upsert: true
    },
    function(err, model) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      return res.json(model);
    }
  );
};

//update update comment
exports.connectupdate = function(req, res) {
  // user_id = req.params.userid,
  var following_id = req.params.followingid;

  console.log(following_id);
  console.log(req.body);

  User.update({
    'following._id': following_id
  }, {
    '$set': {
      'following.$.status': req.body.status,
      'following.$.user': req.body.user,
      'following.$.name': req.body.name,
    }
  }, function(err, model) {
    console.log(model);
    if (err) {
      console.log(err);
      return res.send(err);
    }
    return res.json(model);

  });

};



//update users

exports.update = function(req, res) {
  var userid = req.params.userid;
  var user_data = req.body;

  User.findOneAndUpdate({
    _id: userid
  }, user_data, function(err, user) {
    if (err) {
      console.log(err);
      return res.json(400, err);
    }
    if (!user) {
      console.log('notfound');
      return res.send(404);
    }
    // if(user_data.status)
    // {
    //   console.log("if");
    //   var login_link = [req.headers.host, 'login'].join('/');
    //   (new AdminApproveEmail(user, {loginLink: login_link})).send(function(e) {
    //     return res.send(200);
    //   });

    // }else{

    //   console.log("else");
    return res.send(200);

    // }

  });


};
/** update user status  */

exports.updatestatus = function(req, res) {
  var userid = req.params.userid;
  var user_data = req.body;

  User.findOneAndUpdate({
    _id: userid
  }, user_data, function(err, user) {
    if (err) {
      console.log(err);
      return res.json(400, err);
    }
    if (!user) {
      console.log('notfound');
      return res.send(404);
    }
    if (user_data.status) {
      console.log("if");
      var login_link = [req.headers.host, 'login'].join('/');
      (new AdminApproveEmail(user, {
        loginLink: login_link
      })).send(function(e) {
        return res.send(200);
      });

    } else {

      console.log("else");

      var site_link = [req.headers.host].join('/'),
        mail = "privateinvestmentnetwork@gmail.com";
      (new AdminBlockEmail(user, {
        siteLink: site_link,
        mail: mail
      })).send(function(e) {
        return res.send(200);
      });

    }

  });


};


/**
 * Create user
 */
exports.create = function(req, res, next) {
  var data = req.body,
    getcompanyid = '';

  data.band = '';
  if (data.company == "add-new" && data.companyname.title) {

    var q = Company.findOne({
      'title': data.companyname.title
    });
    /** finally execute */
    q.exec(function(err, company) {
      if (err) {
        console.log(err);
      }
      if (!company) {
        var newcompany = new Company(data.companyname);
        newcompany.save(function(err, companydata) {
          if (err) {
            console.log(err);
            // return res.json(400, err);
          }
          if (companydata) {
            delete data.companyname;
            data.company = companydata._id;
            var newUser = new User(data);
            newUser.provider = 'local';

            newUser.save(function(err, savedUser) {
              if (err) return res.json(400, err);
              if (err) return res.json(400, err);
              var activation_link = [req.headers.host, 'user', savedUser._id, 'verify', savedUser.emailVerification.token].join('/'),
                auto_login_link = [req.headers.host, 'api/session/autologin'].join('/') + '?email=' + savedUser.email + '&token=' + savedUser._id;
              (new ActivationEmail(savedUser, {
                activationLink: activation_link,
                autoLoginLink: auto_login_link
              })).send(function(e) {
                return res.send(savedUser.userInfo);
              });
            });
          }


        });
      } else {
        data.company = company._id;
        var newUser = new User(data);
        newUser.provider = 'local';

        newUser.save(function(err, savedUser) {
          if (err) return res.json(400, err);
          if (err) return res.json(400, err);
          var activation_link = [req.headers.host, 'user', savedUser._id, 'verify', savedUser.emailVerification.token].join('/'),
            auto_login_link = [req.headers.host, 'api/session/autologin'].join('/') + '?email=' + savedUser.email + '&token=' + savedUser._id;
          (new ActivationEmail(savedUser, {
            activationLink: activation_link,
            autoLoginLink: auto_login_link
          })).send(function(e) {
            return res.send(savedUser.userInfo);
          });
        });
      }
    });

  } else {


    //     var newUser = new User(data);
    //     newUser.provider = 'local';

    //     newUser.save(function(err, savedUser) {
    //       if (err) return res.json(400, err);
    //       if (err) return res.json(400, err);
    //       var activation_link = [req.headers.host, 'user', savedUser._id, 'verify', savedUser.emailVerification.token].join('/');
    //       (new ActivationEmail(savedUser, {
    //         activationLink: activation_link
    //       })).send(function(e) {
    //         return res.send(savedUser.userInfo);
    //       });
    //     });
    //   });

    // } else {
    if (data.company == "add-new") {
      delete data['company'];
      delete data['companyname'];
    }
    var newUser = new User(data);
    newUser.provider = 'local';
    newUser.save(function(err, savedUser) {
      if (err) return res.json(400, err);
      console.log(req.headers.host);
      var activation_link = [req.headers.host, 'user', savedUser._id, 'verify', savedUser.emailVerification.token].join('/'),
        auto_login_link = [req.headers.host, 'api/session/autologin'].join('/') + '?email=' + savedUser.email + '&token=' + savedUser._id;
      (new ActivationEmail(savedUser, {
        activationLink: activation_link,
        autoLoginLink: auto_login_link
      })).send(function(e) {
        return res.send(savedUser.userInfo);
      });
    });
  }

};

exports.verifyEmail = function(req, res, next) {
  var userId = req.params.id;
  var token = req.params.token;
  User.findById(userId, function(err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);
    if (user.emailVerification.token === token) {
      user.emailVerification.verified = true;
      user.save(function(err) {
        // req.logIn(user, function(err) {
        //   if (err) return res.send(err);
        //   return res.redirect('/settings');
        // });

        if (err) return res.send(err);
        return res.redirect('/settings');

      });

    } else {
      return res.send(401, 'Invalid Token');
    }
  });
};

/**
 * forgot description
 * @param  {[object]}   req  [description]
 * @param  {[object]}   res  [description]
 * @param  {Function} next [description]
 * @return {[mail json]}        [send mail with reset link]
 */
exports.forgot = function(req, res, next) {
  var email = req.body.email;
  User.findOne({
    email: email
  }, function(err, user) {
    if (err) res.send(400);
    if (!user) {
      return res.send(404, 'This user does not exist');
    }
    user.setForgotPassword();
    user.save(function(err, user) {
      if (err) res.send(400);
      var forgot_link = [req.headers.host, 'user', user._id, 'recover', user.forgotPassword.token].join('/');
      (new ForgotPasswordEmail(user, {
        forgotLink: forgot_link
      })).send(function(e) {
        return res.send(200);
      });
    });
  });
};


/**
 * recover description
 * @param  {[object]}   req  [description]
 * @param  {[object]}   res  [description]
 * @param  {Function} next [description]
 * @return {[recover json]}        [recover with reset link]
 */
exports.recover = function(req, res, next) {
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

//create
exports.uploadusers = function(req, res, next) {

  var data = _.pick(req.body, 'type'),
    uploadPath = '/uploads';
  console.log(req.files);
  if (req.files && req.files.file) {
    var file = req.files.file,
      extension = path.extname(file.name),
      originalName = "users" + extension;
    // get the temporary location of the file
    var tmp_path = file.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './app/uploads/' + originalName,
      savepath = 'uploads/' + originalName;

    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
      // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
      fs.unlink(tmp_path, function() {
        if (err) throw err;
        console.log('File uploaded to: ' + target_path + ' - ' + file.size + ' bytes');
        return res.send(200);
      });

    });

  } else {
    return res.send(403, 'invalid');
  }
};