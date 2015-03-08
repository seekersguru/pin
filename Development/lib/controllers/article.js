'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Article = mongoose.model('Article'),
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
	          uploadPath =  '/uploads',
	          file = req.files.file,
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
						req.body.tags=JSON.parse(req.body.tags);
						var article=new Article(req.body);
						article.save(function(err,article){
						  if(err){
						    console.log(err);
						    return res.json(400, err);
						  } 
						  return res.json({article:article});
						});

        });
    });
	};

//update
exports.update = function(req, res) {
	var article_id = req.params.articleid;
	  var article_data = req.body;
	  delete article_data._id;
	  delete article_data.discovered;
	  delete article_data.nFavorite;
	  delete article_data.author;
	  console.log(req.body);
	  Article.findOneAndUpdate({_id: article_id}, article_data, function(err, article) {
	    if (err) {
	      console.log(err);
	      return res.json(400, err);
	    }
	    if (!article) {
	      console.log('notfound');
	      return res.send(404);
	    }
	    return res.send(200);
	  });


};

// show particluar one article 
exports.show=function(req,res){
	var articleid=req.params.articleid;
	Article.find({_id:articleid})
	.exec(function(err,article){
		if(err){
			console.log(err);
			return res.json(404,err);
		}
		if (!article){
      console.log('notfound');
      return res.send(404);
    }
    if(article)
    {
    	return res.json(article[0]);
    }
    return res.send(403);

	});

};

// show all articles with paging
exports.query = function(req, res) {

	console.log(req);
	var limit=req.query.limit;

	var q=Article.find({});
	 /** apply limit  */
	 if(req.query.limit){
	 	q=q.limit(req.query.limit);
	 }

	 /** skip  */
	 if(req.query.pageno){
	 	q=q.skip((req.query.pageno-1)*req.query.limit);
	 }

	 /** sorting according to date */

	 q.sort('createdAt');

	 /** finally execute */
	 q.exec(function(err, articles) {
	  if (err) {
	    console.log(err);
	    return res.send(404);
	  } else {
	    return res.json({articles:articles});
	  }
	});


};

exports.remove = function(req, res) {
  var article_id = req.params.articleid;
  Article.findOneAndRemove({_id: article_id}, function(err, article) {
    if (err) {
      res.json(400, err);
    } else {
      article.remove();
      res.send(200);
    }
  });
};

