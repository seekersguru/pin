var exports = module.exports = {};

// Add a record
function add_record(Model,data_dict){
	// Model.errors wil contain error messages if validation will fail 
	var model_instance = Model(data_dict);
	model_instance.save(function (err) {
		console.log(err);
	});
	return model_instance;
}


//Update single record
function get_one_record(Model ,constraint){
	var query=	Model.findOne(constraint, function(err,obj) { return  {"error":err,"obj":obj} ;});
	query.exec(function (err, results) { 
		
		if (err){
			constraint["api_error"] = err;
		}
		else {
			constraint["api_success"] = results;
			if (!results) constraint["api_message"] ="No such record";
		}
		
	});
	return constraint;
}


// TODO : Handle if objects are modified properly or not 
//http://stackoverflow.com/questions/29063205/mogoose-findoneandupdate-how-to-know-wether-object-exist-and-if-modified
// One way is get_one_record({_id:obj.emitted.complete[0]._id}) and see if it has errors, but will cost one query 
function update_one_record(Model, unique_constraint, new_updated_values){ 
	obj=Model.findOneAndUpdate(
		//Similarly we have findOneAndRemove
		unique_constraint, 
		{$set: new_updated_values},
		{upsert: true}, 
		function(err, raw){
			console.log(err, raw)
	})
	return obj
	
	
}
//obj.emitted.complete[0]._id

/*
//All good
update_one_record(User, {email:"isit@gm.com"} , {'family_office':"chngs"})
//Object exist but condition is an error to update
// Object not exist 
update_one_record(User, {email:"isit@gm.com"} , {'status':"status not exist "})

update_one_record(User, {email:"sssjh.com"} , {'family_office':"bakal"})



*/


var onerror=
exports.add_record = add_record;
exports.update_one_record = update_one_record;
exports.get_one_record = get_one_record;

/*
var utility = require('./utility.js');
var utility_add_record = utility.add_record;
var utility_update_one_record = utility.update_one_record;
var utility_get_one_record = utility.get_one_record;
*/

