'use strict';

var mongoose = require('mongoose'),
User = mongoose.model('Serviceuser'),
Company = mongoose.model('Company'),
multipart = require('connect-multiparty'),
fs = require('fs'),
path = require('path'),
_ = require('lodash');


//create
exports.create = function(req, res, next) {
       	console.log(req.body);
        	// req.body.tags=req.body.tags;
        	console.log(req.body); 
        	var company=new Company(req.body);
        	company.save(function(err,company){
        		if(err){
        			console.log(err);
        			return res.json(400, err);
        		} 
        		return res.json({company:company});
        	});

  };

//update
exports.update = function(req, res) {
	var article_id = req.params.companyid;
	var article_data = req.body;

	console.log(article_data);

	Company.findOneAndUpdate({_id: article_id}, article_data, function(err, company) {
		if (err) {
			console.log(err);
			return res.json(400, err);
		}
		if (!company) {
			console.log('notfound');
			return res.send(404);
		}
		return res.json({company:company});
	});

};

// show particluar one article 
exports.show=function(req,res){
	var companyid=req.params.companyid;
	Company.findById(companyid)
	.exec(function(err,copmany){
		if(err){
			console.log(err);
			return res.json(404,err);
		}
		if (!copmany){
			console.log('notfound');
			return res.send(404);
		}
		if(copmany)
		{
			return res.json(copmany);
		}
		return res.send(403);

	});

};

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

	q.sort('title');

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
// show all articles with basic info
exports.basic = function(req, res) {

	var q=Company.find({});

	/** sorting according to date */

	q.sort('title');

	/** finally execute */
		q.exec(function(err, company) {
		if (err) {
			console.log(err);
			return res.send(404);
		} else {
			  for(var i=0; i<company.length; i++){
			  	
            company[i] = company[i].companyInfo;
         }
			return res.json({company:company});
		}
	});


};

exports.remove = function(req, res) {
	var article_id = req.params.companyid;
	var companyid=req.params.companyid;

  	  Company.findOneAndRemove({_id: article_id}, function(err, article) {
			if (err) {
				res.json(400, err);
			} else {
				article.remove();
				res.send(200);
		}
	});
};



 //create
exports.uploadcompanies = function(req, res, next) {

  var data = _.pick(req.body, 'type') ,
  uploadPath =  '/uploads';
  console.log(req.files);
  if(req.files && req.files.file)
  {
    var file = req.files.file,
        extension=path.extname(file.name),
        originalName="companies"+extension;
    // get the temporary location of the file
    var tmp_path = file.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './app/uploads/' + originalName,
    savepath='uploads/' + originalName;

    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
          if (err) throw err;
          console.log('File uploaded to: ' + target_path + ' - ' + file.size + ' bytes');
          return res.send(200);    
        });

      });

    }
    else
    {
      return res.send(403, 'invalid');
    }
  };