'use strict';

var mongoose = require('mongoose'),
User = mongoose.model('Serviceuser'),
Family = mongoose.model('Family'),
path = require('path'),
_ = require('lodash');


//create
exports.create = function(req, res, next) {
	var data = _.pick(req.body, 'type') ;
       	console.log(req.body);
        	// req.body.tags=req.body.tags;
        	var family=new Family(req.body);
        	family.save(function(err,family){
        		if(err){
        			console.log(err);
        			return res.json(400, err);
        		} 
        		return res.json({family:family});
        	});
 };

//update
exports.update = function(req, res) {
	var family_id = req.params.familyid;
	var family_data = req.body;
	
	delete family_data._id;

	console.log(req.body);

	Family.findOneAndUpdate({_id: family_id}, family_data, function(err, family) {
		if (err) {
			console.log(err);
			return res.json(400, err);
		}
		if (!family) {
			console.log('notfound');
			return res.send(404);
		}
		return res.send(200);
	});

};


// show particluar one family 
exports.show=function(req,res){
	var familyid=req.params.familyid;
	Family.findById(familyid)
	.exec(function(err,family){
		if(err){
			console.log(err);
			return res.json(404,err);
		}
		if (!family){
			console.log('notfound');
			return res.send(404);
		}
		if(family)
		{
			return res.json(family);
		}
		return res.send(403);

	});

};

// show all familys with paging
exports.query = function(req, res) {

	var limit=req.query.limit;

	var q=Family.find({});
	/** apply limit  */
	if(req.query.limit){
		q=q.limit(req.query.limit);
	}

	/** skip  */
	if(req.query.pageno){
		q=q.skip((req.query.pageno-1)*req.query.limit);
	}
  
	/** sorting according to date */

	q.sort('-createdAt');

	/** finally execute */
	q.exec(function(err, familys) {
		if (err) {
			console.log(err);
			return res.send(404);
		} else {
			return res.json({familys:familys});
		}
	});

};

exports.remove = function(req, res) {
	var family_id = req.params.familyid;
	Family.findOneAndRemove({_id: family_id}, function(err, family) {
		if (err) {
			res.json(400, err);
		} else {
			family.remove();
			res.send(200);
		}
	});
};
