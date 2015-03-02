'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var exports = module.exports = {};


var UserSchema = new Schema({
  family_office:{type:String, required:true}, //eg Premji Invest or Ambani Family
  real_name:{type:String, required:true},
  email:{type:String, required:true , unique:true},
  alias_name_chat:String,
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



