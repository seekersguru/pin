'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
  
var authTypes = ['github', 'twitter', 'facebook', 'google'];

/**
 * User Schema
 */
var UserSchema = new Schema({
  name: String,
  fullname: String,
  alias: String,
  address: String,
  username: { type: String, default: null },
  email: String,
  phone:String,
  membertype:String,
  nominated:String,
  password:String,
  interests:String,
  emailVerification: {
      token: String,
      verified : {type: Boolean, default:false},
      validTill: Date
  },
  forgotPassword: {
    token: String,
    validTill : Date
  },
  role: {type: String, default: 'user', 'enum' : ['user', 'artist', 'admin']},
  hashedPassword: String,
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  github: {},
  google: {},
  createdAt: {type:Date, default: Date.now},
  photo: String,
  bio: String,
  following:[{type: Schema.Types.ObjectId, ref:'User'}],
  nFollowers:{type: Number, default: 0},
  city:String,
  country: {type:String, default: 'India'},
  showAge: {type:Boolean, default: false},
  dob:{type:Date, default: Date.now},
});




module.exports = mongoose.model('User', UserSchema);
