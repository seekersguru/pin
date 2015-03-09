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


//Update single record
function update_one_record(Model, unique_constraint, new_updated_values){ 
		Model.findOneAndUpdate(
		//Similarly we have findOneAndRemove
		unique_constraint, 
		{upsert: true}, 
		function(err, new_updated_values, raw){
	    console.log(err, new_updated_values, raw)
	})
}
	

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

