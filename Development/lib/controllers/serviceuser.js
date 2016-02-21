'use strict';

var mongoose = require('mongoose'),
User = mongoose.model('Serviceuser'),
passport = require('passport'),
Email = require('../email').Email,
ActivationEmail = require('../email').ActivationEmail,
ForgotPasswordEmail = require('../email').ForgotPasswordEmail,
AdminApproveEmail= require('../email').AdminApproveEmail,
AdminBlockEmail= require('../email').AdminBlockEmail,
multipart = require('connect-multiparty'),
fs = require('fs'),
path = require('path'),
_ = require('lodash');


exports.query = function(req, res){
  var q = User.find({role: {'$ne':'admin' }}).populate('company','roletype');
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
      // if(req.user.role !== 'admin'){
        for(var i=0; i<users.length; i++){
          users[i] = users[i].profile;
        }
      // }
      return res.json({users:users});
    }
  });
};

exports.deleteEmailWise=function(req,res){
var allEmail=["chetan.damani@sbi.co.in","chitra.basker@sbi.co.in","fca@vsnl.com","kalpesh.thakar@reuters.com","karan.singh@uti.co.in","naik@saharamutual.com","niraj.chandra@uti.co.in","nirmal.rewaria@edelcap.com","pkchand@birlacorp.com","sanjay.sharma@tatacapital.com","sanjayv@emiratesbank.com","satish.dikshit@uti.co.in","shrikant.tiwari@thomsonreuters.com","simi.mishra@thomsonreuters.com","vijayan.pankajakshan@welingkar.org","wm@tbngconsultants.com","adityavikram.dube@ml.com","amit_pathak@ml.com","anshu.shrivastava@revyqa.com","anuradha_shah@ml.com","apeksha.singh@oracle.com","aprabhu@templeton.com","ashish_gumashta@ml.com","atul_singh1@ml.com","avinash.luthria@gajacapital.com","d.rao@ml.com","dia_sen@ml.com","gfernandes@askgroup.in","girish.venkat@adityabirla.com","hbohara@askgroup.in","lahar.bhasin@icraonline.com","mehul_marfatia@ml.com","michelle_baptist@ml.com","pavit.chadha@ml.com","pkchand@birlacorp.com","pratikbagaria@rathi.com","r.karthik@lodhagroup.com","rajat.sinha@sc.com","rishab_parekh@ml.com","ritika.grover@hdfcbank.com","r_vaidya@ml.com","sandeep.khurana@sbi.co.in","sanjay_bhuwania@ml.com","satwick_tandon@ml.com","saujanya.shrivastava@bharti-axalife.com","shajikumar.devakar@barclaysasia.com","shruti.lohia@in.ey.com","shveta.singh@avendus.com","shyamal.lahon@tvscapital.in","siddharth_mishra@ml.com","skoticha@askgroup.in","svaidya@askgroup.in","tarun@tbngconsultants.com","ulhas.deshpande@bharti-axalife.com","unmesh_kulkarni@ml.com","varadaraya_mallya@ml.com","vikram_agarwal@ml.com","vishal.shah@barclaysasia.com","abhilash.misra@boiaxa-im.com","ajay.aswani@milestonecapital.in","anand.oke@axisbank.com","goswami@waltonst.com","mridulla@geplcapital.com","pkchand@birlacorp.com","query@arcil.co.in","srk@pinnaclefinancialplanners.com","vishal.mhaiskar@motilaloswal.com","asagar@adb.org","balvir@life-lite.com","d.p.singh@sbimf.com","dennythomas@hsbc.co.in","dinesh.khara@sbimf.com","goswami@waltonst.com","govind@acornwealth.com","hiten@kpmg.com","info@srinidhihomes.in","nitinsingh@hsbc.co.in","query@arcil.co.in","r.srinivas@sbimf.com","rahul.pal@taurusmutualfund.com","ravi.r.menon@hsbc.com","s.mahadevan@sbimf.com","sanjayshah@hsbc.co.in","shivdasrao@hsbc.co.in","sinor@amfiindia.com","srk@pinnaclefinancialplanners.com","sunil.avasthi@indianivesh.in","tanya.dere@sbimf.com","vivekmakim@hsbc.co.in","amitav@fiuindia.gov.in","anand@mfl.in","anil.abraham@hdfcbank.com","animeshraizada@hsbc.co.in","anisha.motwani@maxlifeinsurance.com","ankurt@lntmf.com","ashish.chauhan@bseindia.com","ashish.naik@axismf.com","ashissh.dikshit@bcids.org","ashu.suyash@lntmf.com","bharat.banka@adityabirla.com","birens@lntmf.com","c.vasudevan@bseindia.com","charul.shah@greshma.com","chetan1joshi@hsbc.co.in","debaprasad.mukherjee@fiserv.com","devika.shah@bseindia.com","dhirajsachdev@hsbc.co.in","dka@smcindiaonline.com","ekta.keswani@sc.com","gaurav.pandya@adityabirla.com","gaurav.perti@sc.com","ghazala.khatri@warmond.co.in","gopal.lakhotia@sc.com","hitendradave@hsbc.co.in","info@srinidhihomes.in","jayesh.faria@ltcapitalindia.in","jayesh.shroff@sbimf.com","jayna_gandhi@hotmail.com","jitendrasriram@hsbc.co.in","joseph.thomas@adityabirla.com","jyoti.vaswani@avivaindia.com","kailash@lntmf.com","lakshmi.sankar@icicibank.com","m.venkataraghavan@axismf.com","manjeeri@sngpartners.in","manoj.shenoy@ltcapitalindia.in","megha_maheshwari@icicipruamc.com","monalisa.shilov@bnpparibasmf.in","nainakidwai@hsbc.co.in","namitagodbole@plindia.com","navneet.munot@sbimf.com","naysar.shah@birlasunlife.com","nikhil.johri@bnpparibasmf.in","nilesh_c_shah@hotmail.com","nirakar.pradhan@futuregenerali.in","pankaj.murarka@axismf.com","pavri101@hotmail.com","piyushharlalka@hsbc.co.in","prateekjain@hsbc.co.in","praveen.bhatt@axismf.com","puneetchaddha@hsbc.co.in","query@arcil.co.in","r.srinivasan@sbimf.com","rahul_shringarpure@hotmail.com","rajeev.singhal@sbi.co.in","rajeshi@lntmf.com","rajeshp@lntmf.com","rajni@sbbj.co.in","rbajaj@bajajcapital.com","reema.savla@bseindia.com","ricsindia@rics.org","rohit.garg@kotak.com","ruchit.mehta@sbimf.com","saket@comsol.in","sandra.correia@vecinvestments.com","sanjay.dutt@ap.cushwake.com","shantanushankar@hsbc.co.in","shikhab@bajajcapital.com","shirazr@lntmf.com","shreenivashegde@hsbc.co.in","shridhar.iyer@bnpparibasmf.in","shujasiddiqui@ltcapitalindia.in","shwaitavaish@hsbc.co.in","siddharthtaterh@hsbc.co.in","sm2nid@centralbank.co.in","sohini.andani@sbimf.com","srk@pinnaclefinancialplanners.com","suchita.shah@sbimf.com","sudhanshu.asthana@axismf.com","surajs@lntmf.com","tanmaya.desai@sbimf.com","tusharpradhan@hsbc.co.in","uttama@bajajcapital.com","v.hansprakash@issl.co.in","vcskenkare@sancharnet.in","venugopalm@lntmf.com","vijai.mantri@pramerica.com","vijay.prabhu@sbimf.com","vijaykumar@andhrabank.co.in","vikramc@lntmf.com","vimaljain@sbbj.co.in","vineet1patawari@hsbc.co.in","vinod.nair@bseindia.com","vinodv@lntmf.com","virendra@sngpartners.in","viresh.joshi@axismf.com","vishal@cedarwood.co.in","yatin.padia@bseindia.com"];
  allEmail =_.uniq(allEmail);
 var str='';
  for (var i = allEmail.length - 1; i >= 0; i--) {
    console.log("email"+ allEmail[i]);
    User.findOneAndRemove({email:  allEmail[i]}, function(err, user) {
      if (err) {
        console.log("user not deleted");
      } else {
        console.log("user is deleted");
        console.log(user);
        user.remove();
      }
    });
  }
};
// show particluar one user 
exports.show=function(req,res){
  var userid=req.params.userid;
  User.findById(userid).populate('author','name email')
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

exports.update = function(req, res) {
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
      var login_link = [req.headers.host, 'login'].join('/');
      (new AdminApproveEmail(user, {loginLink: login_link})).send(function(e) {
        return res.send(200);
      });
      
    }else{

      console.log("else");

      var site_link = [req.headers.host].join('/'),
          mail = "privateinvestmentnetwork@gmail.com";
      (new AdminBlockEmail(user, {siteLink: site_link,mail:mail})).send(function(e) {
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