'use strict';
//  sesTransport = require('nodemailer').createTransport('SES'),
var nodemailer = require('nodemailer'),
    emailTemplates = require('email-templates'),
    config = require('./config/config'),
    _ = require('lodash');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'swatisinghratan@gmail.com',
        pass: '9887512945'
    }
});

var templatesDir = config.root + config.emailTemplatesPath;
/**
 * Email class
 * Basic email sending functionality
 */
var Email = function(email) {
  this.email = email||{};
  this.email.from = this.email.from ||'PIN <info@pin.com>';
  this.email.text = this.email.text || this.email.message;
};
var mailOptions = {
    from: 'PIN ✔ <swatisinghratan@gmail.com>', // sender address
    to: 'riturajratan@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};

Email.prototype.send = function(cb) {
  transporter.sendMail(mailOptions, function(e, data) {
    if(cb){
      console.log(data);
      cb(e, data.messageId);
    }
   });  
};
/**
 * Send mail to specific registered user.
 */
var UserEmail = function(user, templateName, locals) {
  Email.call(this);
  this.email.to =  user.name + ' <' + user.email + '>';
  this.email.subject = 'Greetings from PIN';
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
      Email.prototype.send.call(that, cb);
    });
  });
};
/**
 * Class to send activation email
 */
var ActivationEmail = function(user, locals) {
  UserEmail.call(this, user, 'activation', locals);
  this.email.subject = 'Please Activate your PIN Account';
};
ActivationEmail.prototype = Object.create(UserEmail.prototype);

/**
 * Class to send forgot password email
 */
var ForgotPasswordEmail = function(user, locals) {
  UserEmail.call(this, user, 'forgot', locals);
  this.email.subject = 'Link to reset PIN password';
};
ForgotPasswordEmail.prototype = Object.create(UserEmail.prototype);

/**
 * Class to send email to contact@PIN when we get an ContactUs Query
 */
var ContactUsEmail = function(locals) {
  UserEmail.call(this, {name: 'PIN ContactUs Query Replier', email: 'contact@PIN.com'}, 'contactus', locals);
  this.email.subject = 'New ContactUs Query from : '+ locals.contactus.email;
};
ContactUsEmail.prototype = Object.create(UserEmail.prototype);

module.exports = {
  Email: Email,
  UserEmail: UserEmail,
  ActivationEmail : ActivationEmail,
  ForgotPasswordEmail: ForgotPasswordEmail,
  ContactUsEmail: ContactUsEmail
};
