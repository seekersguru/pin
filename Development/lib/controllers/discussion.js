
'use strict';

var mongoose = require('mongoose'),
Discussion = mongoose.model('Discussion');


exports.query = function(req, res){
	var q = Discussion.find({});
	q.exec(function(err, discussion) {
		if (err) {
			console.log(err);
			return res.send(404);
		} else {
      // if(req.user.role !== 'admin'){
      	for(var i=0; i<discussion.length; i++){
      		discussion[i] = discussion[i].profile;
      	}
      // }
      return res.json({discussion:discussion});
    }
  });

};

/**
 * Create user
 */
 exports.create = function (req, res, next) {
 	var data = req.body;
 	var newDiscussion = new Discussion(data);
 	newDiscussion.save(function(err, savedDiscussion) {
 		if (err) return res.json(400, err);
 		if (err) return res.json(400, err);
 		return res.send(Discussion.profile);
 	});


 };


 exports.update = function(req, res) {


 };

 exports.remove = function(req, res) {


 };