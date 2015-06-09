'use strict';

var mongoose = require('mongoose'),
Company = mongoose.model('Company'),
fs = require('fs'),
path = require('path'),
_ = require('lodash');



// show all articles with paging
exports.query = function(req, res) {

	var limit=req.query.limit;

	var q=Company.find({});
	/** apply limit  */
	if(req.query.limit){
		q=q.limit(req.query.limit);
	}

	/** skip  */
	if(req.query.pageno){
		q=q.skip((req.query.pageno-1)*req.query.limit);
	}
  
  /** public true  */
  // q.where('public').equals(true);

	/** sorting according to date */

	q.sort('-createdAt');

	/** finally execute */
	q.exec(function(err, articles) {
		if (err) {
			console.log(err);
			return res.send(404);
		} else {
			return res.json({copmanys:articles});
		}
	});


};
