var exports = module.exports = {};
// Add a record
function add_record(Model,values){
	var model_instance = Model(values);
	model_instance.save();
}

//Update single record
function update_record(Model, unique_constraint, new_updated_values){ 
	Model.findOneAndUpdate(unique_constraint, 
			new_updated_values, {upsert:true}, 
			function(err, doc){
				if (err) return {"error":err ,"doc"doc
			};
	    return {"success":"Record succesfully updated" };
	});
}

//Model
//var unique_constraint = {'family_office':"The familly office name "};
//new_updated_values   {'family_office':"The familly office name changed "}
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

exports.add_record = add_record;
exports.update_record = update_record;
exports.validateEmail = validateEmail;
