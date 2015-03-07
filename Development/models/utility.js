var exports = module.exports = {};
// Add a record
function add_record(Model,values){
	var model_instance = Model(values);
	model_instance.save();
}

//Update single record
function update_one_record(Model, unique_constraint, new_updated_values){ 
		Model.Company.findOneAndUpdate(
		unique_constraint, 
		{upsert: true}, 
		function(err, new_updated_values, raw){
	    console.log(err, new_updated_values, raw)
	})
}
	
function get_one_record(Model ,constraint){
	var error=null;
	var obj=	Model.findOne(constraint, 
				function(err,obj) { 
					return  {"error":err,"obj":obj} ;
				}
		);
	
	return obj;
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