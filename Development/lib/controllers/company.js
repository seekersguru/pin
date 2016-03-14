'use strict';

var mongoose = require('mongoose'),
// User = mongoose.model('Serviceuser'),
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
			req.body.url=req.body.title.trim().replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().split(' ').join('-');
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
// show all articles with paging
exports.excel = function(req, res) {

	
	var q=Company.find({});
	
  	/** sorting according to date */
	q.sort('title');
	/** finally execute */
	q.exec(function(err, companies) {
		if (err) {
			console.log(err);
			return res.send(404);
		} else {
			var resultArray=[['NAME','SERVICES','DESCRIPTION','FIRMSUPERTYPE','FIRMTYPE','FIRMSUBTYPE','ORGANIZATION','ADDRESS1.STREET','ADDRESS1.CITY','ADDRESS1.STATE','ADDRESS1.COUNTRY','ADDRESS1.PINCODE','ADDRESS1.PHONE','ADDRESS1.STREET','ADDRESS2.CITY','ADDRESS2.STATE','ADDRESS2.COUNTRY','ADDRESS2.PINCODE','ADDRESS2.PHONE','ADDRESS3.STREET','ADDRESS3.CITY','ADDRESS3.STATE','ADDRESS3.COUNTRY','ADDRESS3.PINCODE','ADDRESS3.PHONE','ADDRESS1.STREET','ADDRESS4.CITY','ADDRESS4.STATE','ADDRESS4.COUNTRY','ADDRESS4.PINCODE','ADDRESS4.PHONE','PUBLIC']];
 			var cl=companies.length;
 		    for(var i=0; i<cl; i++){
 		    	var Address1 =null,Address2 =null,Address3 =null,Address4=null;
 		    	if (companies[i].address[0] !== null){
 		    		Address1=companies[i].address[0];
 		    	}else{
 		    		Address1=null;
 		    	}

 		    	if (companies[i].address[1] !== null){
 		    		Address2=companies[i].address[1];
 		    	}else{
 		    		Address2=null;
 		    	}

 		    	if (companies[i].address[2] !== null){
 		    		Address3=companies[i].address[2];
 		    	}else{
 		    		Address3=null;
 		    	}

 		    	if (companies[i].address[3] !== null){
 		    		Address4=companies[i].address[3];
 		    	}else{
 		    		Address4=null;
 		    	}

	          resultArray.push([companies[i].title,companies[i].services ? companies[i].services.toString():null,companies[i].description,companies[i].firmsupertype,companies[i].firmtype,companies[i].firmsubtype,companies[i].organization,Address1 ? Address1.street : null,Address1 ? Address1.city :null,Address1 ? Address1.state : null ,Address1 ? Address1.country:null,Address1 ?Address1.pin:null,Address1 ? Address1.phone :null,Address2 ? Address2.street : null,Address2 ? Address2.city :null,Address2 ? Address2.state : null ,Address2 ? Address2.country:null,Address2 ?Address2.pin:null,Address2 ? Address2.phone :null,Address3 ? Address3.street : null,Address3 ? Address3.city :null,Address3 ? Address3.state : null ,Address3 ? Address3.country:null,Address3 ?Address3.pin:null,Address3 ? Address3.phone :null,Address4 ? Address4.street : null,Address4 ? Address4.city :null,Address4 ? Address4.state : null ,Address4 ? Address4.country:null,Address4 ?Address4.pin:null,Address4 ? Address4.phone :null,companies[i].public]);
    	    }
      		return res.json(resultArray);
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
            if(req.query.verybasic){
              company[i] = company[i].companySmallInfo;
            }else{
              company[i] = company[i].companyInfo;
            }
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
