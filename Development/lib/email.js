'use strict';
var sesTransport = require('nodemailer').createTransport('SES'),
    emailTemplates = require('email-templates'),
    config = require('./config/config'),
    _ = require('lodash');

var templatesDir = config.root + config.emailTemplatesPath;
/**
 * Email class
 * Basic email sending functionality
 */
var Email = function(email) {
  this.email = email||{};
  this.email.from = this.email.from ||'Paintcollar <noreply@paintcollar.com>';
  this.email.text = this.email.text || this.email.message;
};
Email.prototype.send = function(cb) {
  sesTransport.sendMail(this.email, function(e, data) {
    if(cb){
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
  this.email.subject = 'Greetings from Paintcollar';
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
  this.email.subject = 'Please Activate your Paintcollar Account';
};
ActivationEmail.prototype = Object.create(UserEmail.prototype);

/**
 * Class to send forgot password email
 */
var ForgotPasswordEmail = function(user, locals) {
  UserEmail.call(this, user, 'forgot', locals);
  this.email.subject = 'Link to reset Paintcollar password';
};
ForgotPasswordEmail.prototype = Object.create(UserEmail.prototype);
/**
 * Class to send email at every sales
 */
var SalesEmail = function(user, locals) {
  UserEmail.call(this, user, 'sales', locals);
  this.email.subject = 'You made a sale at Paintcollar';
};
SalesEmail.prototype = Object.create(UserEmail.prototype);
/**
 * Class to send email to sales@paintcollar when we get an order
 */
var OrderRecEmail = function(locals) {
  UserEmail.call(this, {name: 'Paintcollar Order Procesor', email: 'sales@paintcollar.com'}, 'orderrec', locals);
  this.email.subject = 'New Paintcollar Order: '+ locals.order.orderId;
};
OrderRecEmail.prototype = Object.create(UserEmail.prototype);
/**
 * Class to send email to contact@paintcollar when we get an ContactUs Query
 */
var ContactUsEmail = function(locals) {
  UserEmail.call(this, {name: 'Paintcollar ContactUs Query Replier', email: 'contact@paintcollar.com'}, 'contactus', locals);
  this.email.subject = 'New ContactUs Query from : '+ locals.contactus.email;
};
ContactUsEmail.prototype = Object.create(UserEmail.prototype);
/**
 * Class to send email to customer after successfully placing the order
 */
var OrderConfirmationEmail = function(locals) {
  UserEmail.call(this, {name: locals.order.name, email: locals.order.email}, 'orderconfirmation', locals);
  this.email.subject = 'Your Paintcollar Order '+ locals.order.orderId + ' has been successfully placed';
};
OrderConfirmationEmail.prototype = Object.create(UserEmail.prototype);

module.exports = {
  Email: Email,
  UserEmail: UserEmail,
  ActivationEmail : ActivationEmail,
  ForgotPasswordEmail: ForgotPasswordEmail,
  SalesEmail: SalesEmail,
  OrderRecEmail: OrderRecEmail,
  ContactUsEmail: ContactUsEmail,
  OrderConfirmationEmail: OrderConfirmationEmail
};
