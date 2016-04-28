'use strict';

var mongoose = require('mongoose'),
User = mongoose.model('Serviceuser'),
Company = mongoose.model('Company'),
passport = require('passport'),
Email = require('../mmiemail').Email,
ActivationEmail = require('../mmiemail').ActivationEmail,
ForgotPasswordEmail = require('../mmiemail').ForgotPasswordEmail,
AdminApproveEmail= require('../mmiemail').AdminApproveEmail,
AdminBlockEmail= require('../mmiemail').AdminBlockEmail,
multipart = require('connect-multiparty'),
fs = require('fs'),
path = require('path'),
_ = require('lodash');


exports.query = function(req, res){
  var Query = '',
     spiceArray=[],
     pagesize= req.query.pagesize ? req.query.pagesize : 50,
     page=req.query.current ? req.query.current-1 : 0,
    //  q = User.find({role: {'$ne':'admin' }}).populate('company','roletype');
     q = User.find({role: {'$ne':'admin' }}).populate('company','title roletype').skip(page*pagesize).limit(pagesize);

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

  
  if(req.query && req.query.filter){
    Query=JSON.parse(req.query.filter);

    if(Query.status)
    {
        q.where('status').equals(Query.status);
    }

    if(Query.emailVerification)
    {
        q.where('emailVerification.verified').equals(Query.emailVerification);
    }

    if(Query.linkedin){

      if(Query.linkedin === 'linkedin')
      {
          q.where('linkedin').ne(null);
      }
      else if(Query.linkedin === 'direct'){
          q.where('linkedin').exists(false);
      }
   }

    if(Query.role)
    {
        q.where('role').equals(Query.role);
    }

    if(Query.adminrole)
    {
        q.where('adminrole').equals(Query.adminrole);
    }

    if(Query.city)
    {
        q.where('address.city').equals(Query.city);
    }

    if(Query.role)
    {
        q.where('role').equals(Query.role);
    }
    if(Query.company){
       q.where('company').equals(Query.company);
      }

    if(Query.createdAt && Query.createdAt.startDate && Query.createdAt.endDate){
    console.log(Query);
     q.where({createdAt: {$gte:  Query.createdAt.startDate,$lte: Query.createdAt.endDate}});

    }

  }


  q.exec(function(err, users) {
    if (err) {
      console.log(err);
      return res.send(404);
    } else {
      // if(req.user.role !== 'admin'){
        for(var i=0; i<users.length; i++){
          users[i] = users[i].profile;
        }

        if(spiceArray.length)
        {
          var b = spiceArray.length;
          while (b--) {
                users.splice(spiceArray[b], 1);
            }
        }
      // }
      User.count().exec(function(err, count) {
        return res.json({users:users,totalElement:count});
      });
    }
  });
};

exports.excel = function(req, res){
  var Query = '',
     spiceArray=[],
     q = User.find({role: {'$ne':'admin' }}).populate('company','title roletype');

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

  
  if(req.query && req.query.filter){
    Query=JSON.parse(req.query.filter);

    if(Query.status)
    {
        q.where('status').equals(Query.status);
    }

    if(Query.emailVerification)
    {
        q.where('emailVerification.verified').equals(Query.emailVerification);
    }

    if(Query.linkedin){

      if(Query.linkedin === 'linkedin')
      {
          q.where('linkedin').ne(null);
      }
      else if(Query.linkedin === 'direct'){
          q.where('linkedin').exists(false);
      }
   }

    if(Query.role)
    {
        q.where('role').equals(Query.role);
    }

    if(Query.adminrole)
    {
        q.where('adminrole').equals(Query.adminrole);
    }

    if(Query.city)
    {
        q.where('address.city').equals(Query.city);
    }

    if(Query.role)
    {
        q.where('role').equals(Query.role);
    }
     if(Query.company){
       q.where('company').equals(Query.company);
     }


    if(Query.createdAt && Query.createdAt.startDate && Query.createdAt.endDate){
     q.where({createdAt: {$gte:  Query.createdAt.startDate,$lte: Query.createdAt.endDate}});
    }

  }


  q.exec(function(err, users) {
    if (err) {
      console.log(err);
      return res.send(404);
    } else {
      var resultArray=[['EMAIL','COMPANY','USERNAME','FIRSTNAME','SURNAME','JOBTITLE','DATEREGISTRATION','MOBILE','CITY','AUTOLOGIN']];
      var roleType=['CEO/business head',
      'Management',
      'Sales/Marketing',
      'Investment/Product',
      'RM/client facing',
      'Investment Mgmt',
      'Product Mgmt']
      // if(req.user.role !== 'admin'){
        for(var i=0; i<users.length; i++){
          resultArray.push([users[i].email,users[i].company !== null ? users[i].company.title:null,users[i].username,users[i].firstname,users[i].lastname, users[i].adminrole ? roleType[users[i].adminrole -1]:null,new Date(users[i].createdAt),users[i].phone,users[i].address !== null ? users[i].address.city: null,'http://moneymanagementindia.net/api/session/autologin?email='+users[i]._id+'&token='+users[i]._id]);
        }
      return res.json(resultArray);
    }
  });
};

exports.fullexcel = function(req, res){
  var Query = '',
     spiceArray=[],
     q = User.find({role: {'$ne':'admin' }}).populate('company','title roletype');

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

  
  if(req.query && req.query.filter){
    Query=JSON.parse(req.query.filter);

    if(Query.status)
    {
        q.where('status').equals(Query.status);
    }

    if(Query.emailVerification)
    {
        q.where('emailVerification.verified').equals(Query.emailVerification);
    }

    if(Query.linkedin){

      if(Query.linkedin === 'linkedin')
      {
          q.where('linkedin').ne(null);
      }
      else if(Query.linkedin === 'direct'){
          q.where('linkedin').exists(false);
      }
   }

    if(Query.role)
    {
        q.where('role').equals(Query.role);
    }

    if(Query.adminrole)
    {
        q.where('adminrole').equals(Query.adminrole);
    }

    if(Query.city)
    {
        q.where('address.city').equals(Query.city);
    }

    if(Query.role)
    {
        q.where('role').equals(Query.role);
    }
    if(Query.company){
       q.where('company').equals(Query.company);
    }


    if(Query.createdAt && Query.createdAt.startDate && Query.createdAt.endDate){
     q.where({createdAt: {$gte:  Query.createdAt.startDate,$lte: Query.createdAt.endDate}});
    }

  }


  q.exec(function(err, users) {
    if (err) {
      console.log(err);
      return res.send(404);
    } else {
      var resultArray=[['EMAIL','COMPANY','USERNAME','FIRSTNAME','SURNAME','JOBTITLE','DATEREGISTRATION','MOBILE','CITY','LINKEDIN.ID','LINKEDIN.PROFILEPICURL','LINKEDIN.PROFILEURL']];
      var roleType=['CEO/business head',
      'Management',
      'Sales/Marketing',
      'Investment/Product',
      'RM/client facing',
      'Investment Mgmt',
      'Product Mgmt']
      // if(req.user.role !== 'admin'){
        for(var i=0; i<users.length; i++){

          resultArray.push([users[i].email,users[i].company !== null ? users[i].company.title:null,users[i].username,users[i].firstname,users[i].lastname, users[i].adminrole ? roleType[users[i].adminrole -1]:null,new Date(users[i].createdAt),users[i].phone,users[i].address !== null ? users[i].address.city: null,users[i].linkedin ? users[i].linkedin.id :null,users[i].linkedin ? users[i].linkedin.pictureUrl :null,users[i].linkedin ? users[i].linkedin.publicProfileUrl :null]);
        }
      return res.json(resultArray);
    }
  });
};

// show particluar one user
exports.show=function(req,res){
  var userid=req.params.userid;
  User.findById(userid).populate('author','name email').populate('company','title address roletype')
  .exec(function(err,user){
    if(err){
      console.log(err);
      return res.json(404,err);
    }
    if (!user){
      console.log('notfound');
      return res.send(404);
    }
    if(user)
    {
      return res.json(user);
    }
    return res.send(403);

  });

};

/** checkusername that it is exist or not */
exports.checkusername= function(req, res, next){
  var username = req.params.username;
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

/** checkusername that it is exist or not */
exports.search= function(req, res){
  var username = req.params.username;
  var regex = new RegExp(username, 'i');  // 'i' makes it case insensitive
  var q = User.find({name: regex});

  q.where('status').equals(true);
  q.where('searchable').equals(true);

   q.exec(function(err,users) {
    if (err) {
      console.log(err);
      return res.send(404);
    } else {
       for(var i=0; i<users.length; i++){
          users[i] = users[i].userInfo;
        }
      return res.json({users:users});
    }
  });
};

/** checkusername that it is exist or not */
exports.connect= function(req, res){
  var user_id = req.params.userid;
   User.findByIdAndUpdate(
    user_id,
    {$push: {"following": req.body}},
    {safe: true, upsert: true},
     function(err, model) {
        if(err){
          console.log(err);
          return res.send(err);
        }
        return res.json(model);
     }
    );
};

  //update update comment
  exports.connectupdate=function(req, res){
     // user_id = req.params.userid,
    var following_id = req.params.followingid;

    console.log(following_id);
    console.log(req.body);

    User.update({'following._id': following_id}, {'$set': {
    'following.$.status': req.body.status,
    'following.$.user': req.body.user,
    'following.$.name': req.body.name,
     }}, function(err,model) {
      console.log(model);
      if(err){
          console.log(err);
          return res.send(err);
        }
        return res.json(model);

    });

  };

//update users
exports.update = function(req, res, next) {
  var data = req.body,
    userid = req.params.userid,
    user_data = req.body,
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
            return res.json(400, err);
          }
          if (companydata) {
            delete data.companyname;
            user_data.company = companydata._id;
            User.findOneAndUpdate({_id: userid}, user_data, function(err, user) {
                if (err) {
                  return res.json(400, err);
                }
                if (!user) {
                  return res.send(404);
                }
                return res.send(200);
              });

          }
       });
      } else {
          user_data.company = company._id;
          User.findOneAndUpdate({_id: userid}, user_data, function(err, user) {
                  if (err) {
                    return res.json(400, err);
                  }
                  if (!user) {
                    return res.send(404);
                  }
                  return res.send(200);
            });
      }
    });

  } else {
    if (data.company == "add-new") {
      delete data['company'];
      delete data['companyname'];
    }
    user_data.provider = 'local';
    User.findOneAndUpdate({_id: userid}, user_data, function(err, user) {
                  if (err) {
                    return res.json(400, err);
                  }
                  if (!user) {
                    return res.send(404);
                  }
                  return res.send(200);
            });
  }
};




/** update user status  */

exports.updatestatus = function(req, res) {
  var userid = req.params.userid;
  var user_data = req.body;

  User.findOneAndUpdate({_id: userid}, user_data, function(err, user) {
    if (err) {
      console.log(err);
      return res.json(400, err);
    }
    if (!user) {
      console.log('notfound');
      return res.send(404);
    }
    if(user_data.status)
    {
      console.log("if");
      var login_link = ['http://moneymanagementindia.net', 'login'].join('/');
      (new AdminApproveEmail(user, {loginLink: login_link,name:user.firstname})).send(function(e) {
        return res.send(200);
      });

    }else{

      console.log("else");

      var site_link = ['http://moneymanagementindia.net'].join('/'),
          mail = "admin@moneymanagementindia.net";
      (new AdminBlockEmail(user, {siteLink: site_link,mail:mail,name:user.firstname})).send(function(e) {
        return res.send(200);
      });

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
    if (err) return res.json(400, err);
    console.log(req.headers.host);
    var activation_link = [req.headers.host, 'user', savedUser._id,'verify',  savedUser.emailVerification.token].join('/');
    (new ActivationEmail(savedUser, {activationLink: activation_link})).send(function(e) {
      return res.send(savedUser.userInfo);
    });
   // return res.send(savedUser.userInfo);
});

};

exports.verifyEmail = function (req, res, next) {
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

/** delete users as per emailID **/ 
exports.deleteEmailWise=function(req,res){
   User.findOne({email: email}, function(err, user) {
      if (err) res.send(400);
      if (!user) {
        return res.send(404, 'This user does not exist');
      }
      User.findOneAndRemove({email:  req.params.email}, function(err, user) {
          if (err) {
            res.json(400, err);
          } else {
            user.remove();
            res.send(200);
          }
      });
  });
};


exports.remove = function(req, res) {
  var article_id = req.params.userid;
  var articleid=req.params.userid;
  User.findById(articleid)
  .exec(function(err,article){
    if(err){
      console.log(err);
      return res.json(404,err);
    }
    if (!article){
      console.log('notfound');
      return res.send(404);
    }
    if(article)
    {
      User.findOneAndRemove({_id: article_id}, function(err, article) {
      if (err) {
        res.json(400, err);
      } else {
        article.remove();
        res.send(200);
    }
  });
}
});
};



/**
 * recover description
 * @param  {[object]}   req  [description]
 * @param  {[object]}   res  [description]
 * @param  {Function} next [description]
 * @return {[recover json]}        [recover with reset link]
 */
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

 //create
exports.uploadusers = function(req, res, next) {

  var data = _.pick(req.body, 'type') ,
  uploadPath =  '/uploads';
  console.log(req.files);
  if(req.files && req.files.file)
  {
    var file = req.files.file,
        extension=path.extname(file.name),
        originalName="users"+extension;
    // get the temporary location of the file
    var tmp_path = file.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './app/uploads/' + originalName,
    savepath='uploads/' + originalName;

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

    }
    else
    {
      return res.send(403, 'invalid');
    }
  };
