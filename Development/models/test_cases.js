var user = require('./user.js');
  
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/api');


user= new  user.User({"family_office":"The familly office name "});
user.save()
//function new_user(){
//	
//	user= new  User({"family_office":"The familly office name "});
//	user.save()
//}
//
//new_user();