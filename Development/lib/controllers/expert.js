'use strict';

var mongoose = require('mongoose'),
User = mongoose.model('Serviceuser'),
Expert = mongoose.model('Expert'),
multipart = require('connect-multiparty'),
fs = require('fs'),
path = require('path'),
_ = require('lodash');


/**
 * Create file upload
 */
 exports.upload = function (req, res, next) {
 	var data = _.pick(req.body, 'type'),
 	uploadPath = path.normalize(cfg.data + '/uploads'),
 	file = req.files.file;
        console.log(file.name); //original name (ie: sunset.png)
        console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)
    console.log(uploadPath); //uploads directory: (ie: /home/user/data/uploads)
  };


//create
exports.create = function(req, res, next) {

	var data = _.pick(req.body, 'type') ,
	uploadPath =  '/uploads';
	console.log(req.files);
	if(req.files && req.files.file)
	{

	var file = req.files.file,
	extension=path.extname(file.name);

	var originalName=Date.now()+extension;
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

        	req.body.media={
        		extension: file.type,
        		name:file.name,
        		path:savepath,
        		originalName:file.name
        	};
        	console.log(req.body);
        	// req.body.tags=JSON.parse(req.body.tags);
        	var expert=new Expert(req.body);
        	expert.save(function(err,expert){
        		if(err){
        			console.log(err);
        			return res.json(400, err);
        		} 
        		return res.json({expert:expert});
        	});

        });
      });
  }
  else
  {
       	console.log(req.body);
        	// req.body.tags=req.body.tags;
        	var expert=new Expert(req.body);
        	expert.save(function(err,expert){
        		if(err){
        			console.log(err);
        			return res.json(400, err);
        		} 
        		return res.json({expert:expert});
        	});

  }
  };

//update
exports.update = function(req, res) {
	var expert_id = req.params.expertid;
	var expert_data = req.body;
	delete expert_data._id;

	console.log(req.body);
		var data = _.pick(req.body, 'type') ,
	uploadPath =  '/uploads';
	console.log(req.files);
	if(req.files && req.files.file)
	{

	var file = req.files.file,
	extension=path.extname(file.name);

	var originalName=Date.now()+extension;
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

        	expert_data.media={
        		extension: file.type,
        		name:file.name,
        		path:savepath,
        		originalName:file.name
        	};
					Expert.findOneAndUpdate({_id: expert_id}, expert_data, function(err, expert) {
							if (err) {
								console.log(err);
								return res.json(400, err);
							}
							if (!expert) {
								console.log('notfound');
								return res.send(404);
							}
							return res.send(200);
						});
			  });
      });
  }
  else
  {

	Expert.findOneAndUpdate({_id: expert_id}, expert_data, function(err, expert) {
		if (err) {
			console.log(err);
			return res.json(400, err);
		}
		if (!expert) {
			console.log('notfound');
			return res.send(404);
		}
		return res.send(200);
	});

}

};

//remove media
exports.removemedia = function(req, res) {
	var expert_id = req.params.expertid;
	var expert_data = {'media':{}};
	Expert.findOneAndUpdate({_id: expert_id}, expert_data, function(err, expert) {
		if (err) {
			console.log(err);
			return res.json(400, err);
		}
		if (!expert) {
			console.log('notfound');
			return res.send(404);
		}
		return res.send(200);
	});

};

// show particluar one expert 
exports.show=function(req,res){
	var expertid=req.params.expertid;
	Expert.findById(expertid)
	.exec(function(err,expert){
		if(err){
			console.log(err);
			return res.json(404,err);
		}
		if (!expert){
			console.log('notfound');
			return res.send(404);
		}
		if(expert)
		{
			return res.json(expert);
		}
		return res.send(403);

	});

};

// show all experts with paging
exports.query = function(req, res) {

	var limit=req.query.limit;

	var q=Expert.find({});
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
	q.exec(function(err, experts) {
		if (err) {
			console.log(err);
			return res.send(404);
		} else {
			return res.json({experts:experts});
		}
	});


};
// show all experts with basic info
exports.basic = function(req, res) {

	var q=Expert.find({});

	/** sorting according to date */

	q.sort('-createdAt');

	/** finally execute */
		q.exec(function(err, experts) {
		if (err) {
			console.log(err);
			return res.send(404);
		} else {
			  for(var i=0; i<experts.length; i++){
			  	
            experts[i] = experts[i].expertInfo;
         }
			return res.json({experts:experts});
		}
	});


};

exports.remove = function(req, res) {
	var expert_id = req.params.expertid;

	var expertid=req.params.expertid;
	Expert.findById(expertid)
	.exec(function(err,expert){
		if(err){
			console.log(err);
			return res.json(404,err);
		}
		if (!expert){
			console.log('notfound');
			return res.send(404);
		}
		if(expert)
		{
			fs.unlink('./app/'+expert.media.path, function() {
        	if (err) throw err;
    			Expert.findOneAndRemove({_id: expert_id}, function(err, expert) {
						if (err) {
							res.json(400, err);
						} else {
							expert.remove();
							res.send(200);
						}
					});

    		});
		}
	});
};


//remove media
exports.removemedia = function(req, res) {
	var expert_id = req.params.expertid;
	var expertid=req.params.expertid;
	Expert.findById(expertid)
	.exec(function(err,expert){
		if(err){
			console.log(err);
			return res.json(404,err);
		}
		if (!expert){
			console.log('notfound');
			return res.send(404);
		}
		if(expert)
		{
			fs.unlink('./app/'+expert.media.path, function() {
        	if (err) throw err;
    			var expert_data = {'media':{}};
					Expert.findOneAndUpdate({_id: expert_id}, expert_data, function(err, expert) {
						if (err) {
							console.log(err);
							return res.json(400, err);
						}
						if (!expert) {
							console.log('notfound');
							return res.send(404);
						}
						return res.send(200);
					});
    		});
		}
	});

};

