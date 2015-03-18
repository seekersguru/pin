'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;
var exports = module.exports = {};

var user = require('./user.js');
var UserSchema = user.UserSchema;

/*
 * Common 
 */
var FriendSchema = new Schema({
  from: { type: ObjectId, ref: 'User', required: true },
  to: { type: ObjectId, ref: 'User', required: true },
  status: {type: String, enum: ['sent', 'approved', 'rejected']},
  created_at    : { type: Date },
  updated_at    : { type: Date }
});




// Todo : Add creted at updated at just like in User, as well do it properly their as well. 
FriendSchema.pre('save', function(next){
	  var now = new Date();
	  this.updated_at = now;
	  this.created_at = now;
	  next();
	});
FriendSchema.pre('update', function(next){
	  var now = new Date();
	  this.updated_at = now;
	  
	  next();
	});

//TODO Ensure indexes for all the get queries in the functions related to schema
FriendSchema.methods ={
		add_friend:function (from_email , to_email){
			console.log(from_email);
			console.log(to_email);
			var from_user=UserSchema.methods.get_user({"email":from_email})["api_success"]
			//if (!from_user)from_user=null;
			var to_user=UserSchema.methods.get_user({"email":to_email})["api_success"]
			//if (!to_user)to_user=null;
			if (!from_user )return {"api_error":"From email not valid"}
			if (!to_user )return {"api_error":"To email not valid"}
			return {"api_success":"Jai Baat"}
			
		}
};


exports.FriendSchema = FriendSchema;
