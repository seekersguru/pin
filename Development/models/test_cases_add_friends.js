var friend = require('./friend.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pin-dev');

FriendSchema = friend.FriendSchema;


/*Add Users */


function create_dummy_user(email){
	//Test case create User 
	uo  =UserSchema.methods.create_user(
			{"status":"email_verification_pending" , 
				"password":"nishu" , 
				"address.country":"coun","family_office":"my famile" ,
				"address.city":"city address" ,
				"real_name":"real_namess" ,
				"email":email});
}
//1) Created 4 users 
//create_dummy_user("user1@test.com")
//create_dummy_user("user2@test.com")
//create_dummy_user("user3@test.com")
//create_dummy_user("user4@test.com")




