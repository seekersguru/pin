var user = require('./user.js');
//Even following works 
///home/arnetworks/projects/pin/Development/models/user.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/api');

User = user.User;
user= new  user.User({	"email":"sbb",
						//"real_name":"Nishant",
						"family_office":"The familly office name "});
user.save(function (err) {
    console.log(err);
});

//function new_user(){
//	
//	user= new  User({"family_office":"The familly office name "});
//	user.save()
//}
//
//new_user();


//var query = {'family_office':"The familly office name "};
//User.findOneAndUpdate(query, 
//		{'family_office':"The familly office name changed "}, {upsert:true}, function(err, doc){
//    if (err) return {"error":"Some unexpected error "};
//    
//    
//    return {"success":"Record succesfully updated" };
//});
//
//
//function add_record(model,values){
//	var model_instance = model(values);
//	model_instance.save();
//}

