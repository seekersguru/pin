'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var exports = module.exports = {};
/*
Family Office or Family Name – eg Premji Invest or Ambani Family
Name – real name
Alias  - to be used for chats

Address with street address optional but city/country compulsory
Email
Phone/Mobile

Member type – family/family office/nominee (indicate relationship to family)
Nominated by - …text field… 

Interests – topics listed in CMS, services listed in service directory, events type listed in events

Admin will check the nominated by before approving membership; will also put family into a Wealth band (30m+, 5-30m, <5m)
*/

var FriendSchema = new Schema({
  from: { type: ObjectId, ref: 'User', required: true },
  to: { type: ObjectId, ref: 'User', required: true },
  status: {type: String, enum: ['sent', 'approved', 'rejected']}
  created_at    : { type: Date },
  updated_at    : { type: Date }
});
var uniqueValidator = require('mongoose-unique-validator');
UserSchema.plugin(uniqueValidator, { message:
			'{PATH} {VALUE} already  exists'}) //e.g. email nishu@gm.com already exists
UserSchema.pre('save', function(next){
	  var now = new Date();
	  this.updated_at = now;
	  this.created_at = now;
	  next();
	});
UserSchema
.virtual('password')
.set(function(password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(password);
})
.get(function() {
  return this._password;
});

//
////Validate email is not taken
//UserSchema
//  .path('email')
//  .validate(function(value, respond) {
//    var self = this;
//    this.constructor.findOne({email: value}, function(err, user) {
//      if(err) throw err;
//      if(user) {
//        if(self.id === user.id) return respond(true);
//        return respond(false);
//      }
//      respond(true);
//    });
//}, 'The specified email address is already in use.');

//When save auto fill the registration date
//UserSchema.pre('save', function(next){
//	  var now = new Date();
//	  this.updated_at = now;
//	  this.created_at = now;
//	  next();
//	});

////When update  auto fill the last updated date
//UserSchema.pre('update', function(next){
//	  var now = new Date();
//	  this.updated_at = now;
//	  next();
//	});

var User = mongoose.model('User', UserSchema);
exports.User = User;



