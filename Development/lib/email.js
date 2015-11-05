'use strict';
var sesTransport = require('nodemailer').createTransport('SES'),
    nodemailer = require('nodemailer'),
    emailTemplates = require('email-templates'),
    config = require('./config/config'),
    _ = require('lodash');

var transporter = nodemailer.createTransport("SMTP",{
    service: 'gmail',
    auth: {
        user: 'privateinvestmentnetwork',
        pass: 'networkinvestmentprivate'
    }
});

var templatesDir = config.root + config.emailTemplatesPath;
/**
 * Email class
 * Basic email sending functionality
 */
var Email = function(email) {
  this.email = email||{};
  this.email.from = this.email.from ||'MMI TEAM <admin@moneymanagementindia.net>';
  this.email.text = this.email.text || this.email.message;
};
Email.prototype.send = function(cb) {
  transporter.sendMail(this.email, function(e, data) {
    if(cb){
      console.log(data);
      cb(e, data);
    }
   });  
};
/**
 * Send mail to specific registered user.
 */
var UserEmail = function(user, templateName, locals) {
  Email.call(this);
  this.email.to =  user.firstname + ' <' + user.email + '>';
  this.email.subject = 'Greetings from MMI';
  this.templateName  = templateName;
  this.locals = _.merge({user: user}, locals || {});
};
UserEmail.prototype = Object.create(Email.prototype);
UserEmail.prototype.send = function(cb) {
  var that = this;
  emailTemplates(templatesDir, function (err, template) {
    if (err) throw err;
    template(that.templateName, that.locals, function(err, html, text) {
      if (err) throw err;
      that.email.html = html;
      that.email.text = text;
      console.log(that.email);
      Email.prototype.send.call(that, cb);
    });
  });
};
/**
 * Class to send activation email
 */
var ActivationEmail = function(user, locals) {
  UserEmail.call(this, user, 'activation', locals);
  this.email.subject = 'Please Activate your MMI Account';
};
ActivationEmail.prototype = Object.create(UserEmail.prototype);

/**
 * Class to send activation user approve email 
 */
var AdminApproveEmail = function(user, locals) {
  UserEmail.call(this, user, 'adminapprove', locals);
  this.email.subject = 'Admin Approved Your MMI Account';
};

AdminApproveEmail.prototype = Object.create(UserEmail.prototype);

/**
 * Class to send activation user approve email 
 */
var AdminBlockEmail = function(user, locals) {
  UserEmail.call(this, user, 'adminblock', locals);
  this.email.subject = 'Admin Block Your MMI Account';
};

AdminBlockEmail.prototype = Object.create(UserEmail.prototype);

/**
 * Class to send forgot password email
 */
var ForgotPasswordEmail = function(user, locals) {
  UserEmail.call(this, user, 'forgot', locals);
  this.email.subject = 'Link to reset MMI password';
};
ForgotPasswordEmail.prototype = Object.create(UserEmail.prototype);

/**
 * Class to send email to contact@MMI when we get an ContactUs Query
 */
var ContactUsEmail = function(locals) {
  UserEmail.call(this, {name: 'MMI ContactUs Query Replier', email: 'admin@moneymanagementindia.net'}, 'contactus', locals);
  this.email.subject = 'New ContactUs Query from : '+ locals.contactus.email;
};
ContactUsEmail.prototype = Object.create(UserEmail.prototype);

module.exports = {
  Email: Email,
  UserEmail: UserEmail,
  ActivationEmail : ActivationEmail,
  ForgotPasswordEmail: ForgotPasswordEmail,
  ContactUsEmail: ContactUsEmail,
  AdminApproveEmail:AdminApproveEmail,
  AdminBlockEmail:AdminBlockEmail
};
