'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var exports = module.exports = {};
  
var UserSchema = new Schema({
  
  family_office:String, //eg Premji Invest or Ambani Family
  real_name:String,
  alias_name_chat:String,
  created_at    : { type: Date },
  updated_at    : { type: Date }
 
});

UserSchema.pre('save', function(next){
	  var now = new Date();
	  this.updated_at = now;
	  if ( !this.created_at ) {
	    this.created_at = now;
	  }
	  next();
	});
 

var User = mongoose.model('User', UserSchema);

exports.User = User;

//module.exports = mongoose.model('User', UserSchema);






