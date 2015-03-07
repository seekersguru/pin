'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');


var exports = module.exports = {};

/*Common to be imported for all models; TODO : Find some proper way */
var utility = require('./utility.js');
var utility_add_record = utility.add_record;
var utility_update_one_record = utility.update_one_record;
var utility_get_one_record = utility.get_one_record;
var onerror=utility.onerror;

var uniqueValidator = require('mongoose-unique-validator');

var assert_validator =require('mongoose-assert')(mongoose); 
// email , minl, max length , number , price etc 
//TODO Customize message, for min and max length : Option 1 like above in assert plugin . (Option 2): Create new as suggested in mongoose-assert plugin doc
//https://www.npmjs.com/package/mongoose-assert


/*


Alias  - to be used for chats

Address with street address optional but city/country compulsory
Email
Phone/Mobile

Member type – family/family office/nominee (indicate relationship to family)
Nominated by - …text field… 

Interests – topics listed in CMS, services listed in service directory, events type listed in events

Admin will check the nominated by before approving membership; will also put family into a Wealth band (30m+, 5-30m, <5m)
*/

//npm install --save mongoose-assert	


var UserSchema = new Schema({
  //Tip: How to get label and help text : UserSchema.tree.family_office.label
  family_office:{type:String, required:true 
	  			,label:"Family Office or Family Name"
	  			,help_text:"Family Office or Family Name – eg Premji Invest or Ambani Family"}, 
  real_name:{type:String, required:true,
	  		label:"Name",
	  		help_text:"Name – real name"},
  email:{type:String, required:true , unique:true},
  address:{
	  line1 : {type: String,label:"Address line1",help_text:"Address line1"},
	  line2 : {type: String,label:"Address line2",help_text:"Address line2"},
	  city : {type: String,required:true,label:"City",help_text:"Enter the city you resides most"},
	  country : {type: String,required:true,label:"Country",help_text:"Country you resides most"}
  },
  phonemobile:{type:String},
  hashedPassword: {type:String , required:true },
  alias_name_chat:{type: String,label:"Alias",help_text:"Alias  - to be used for chats"},
  created_at    : { type: Date },
  updated_at    : { type: Date },
  status: {type: String,required:true , enum: ['email_verification_pending','pending', 'approved', 'blocked']},
});
/**
 * Virtuals
 */
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
UserSchema.plugin(uniqueValidator, { message:
'{PATH} {VALUE} already  exists'}) //e.g. email abc@xyz.com already exists

UserSchema.path('family_office')
	.length(2,100)	
UserSchema.path('real_name')
	.length(2,100)	
UserSchema.path('email')
	.email()
	.length(5,150)
	

UserSchema.path('real_name')
	.length(2,300)	
UserSchema.path('alias_name_chat')
	.length(2,300)
UserSchema.path('phonemobile')
	.length(5,30)	
UserSchema.path('address.line1')
	.length(0,550)	
UserSchema.path('address.line2')
	.length(0,550)	
UserSchema.path('address.city')
	.length(2,150)	
UserSchema.path('address.country')
	.length(2,150)	

UserSchema.pre('save', function(next){
	  var now = new Date();
	  this.updated_at = now;
	  this.created_at = now;
	  this.email=this.email.toLowerCase().trim()
	  next();
	});
UserSchema.pre('update', function(next){
	  var now = new Date();
	  this.updated_at = now;
	  this.email=this.email.toLowerCase().trim()
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

/*
 {"email":"F1@gm.com","real_name":"Nishant","family_office":"The familly office name "}
 */

//TODO Ensure indexes for all the get queries in the functions related to schema
UserSchema.methods ={
		create_user:function(data_dict){
			var err=null;
				
			var userObj= new  User(data_dict);
			userObj.save(function (err) {
				userObj.error =  err;
				console.log(err);
			});
			// console.log(this.error);
			// if (userObj.error ) return {"error": userObj.error};
			// return userObj
			
		},
		approve_user:function(){console.log("approve_user")},
		block_user:function(){console.log("block_user")},
		get_user:function(){console.log("get_user")},
		forgot_password:function(){console.log("forgot_password")},
		change_password:function(){console.log("change_password")},
		authenticate: function(plainText) {
		    return this.encryptPassword(plainText) === this.hashedPassword;
		},
	
		makeSalt: function() {
			return crypto.randomBytes(16).toString('base64');
		},
		encryptPassword: function(password) {
			if (!password || !this.salt) return '';
			var salt = new Buffer(this.salt, 'base64');
			return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
		},
		generateNewEmailVerification : function () {
			return {
				token: crypto.randomBytes(16).toString('hex'),
				verified : false,
				validTill: Date.now() + 24*3600*1000
			};
		},
		setForgotPassword : function () {
			if (!(this.forgotPassword && 
					this.forgotPassword.token &&
					this.forgotPassword.validTill > Date.now())) {
						this.forgotPassword =  {
							token: crypto.randomBytes(16).toString('hex'),
							validTill: Date.now() + 24*3600*1000
					};
			}
		} 
 
}
var User = mongoose.model('User', UserSchema);
exports.User = User;
exports.UserSchema = UserSchema;



