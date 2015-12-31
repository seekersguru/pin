'use strict';

var mongoose = require('mongoose'),
User = mongoose.model('Serviceuser'),
Article = mongoose.model('Article'),
multipart = require('connect-multiparty'),
fs = require('fs'),
Q = require('q'),
path = require('path'),
_ = require('lodash');

Article.collection.ensureIndex({title: 'text', description: 'text', tags: 'text', mmitags: 'text', category: 'text', mmicategory: 'text', mmisubcategory: 'text'}, function(error) {console.log("get index");});
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
  }
  else
  {
       	console.log(req.body);
        	// req.body.tags=req.body.tags;
        	var article=new Article(req.body);
        	article.save(function(err,article){
        		if(err){
        			console.log(err);
        			return res.json(400, err);
        		}
        		return res.json({article:article});
        	});

  }
  };

//update
exports.update = function(req, res) {
	var article_id = req.params.articleid;
	var article_data = req.body;
	delete article_data._id;
	delete article_data.discovered;
	delete article_data.nFavorites;
	delete article_data.author;
	delete article_data.tags;
	delete article_data.comments;

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

        	article_data.media={
        		extension: file.type,
        		name:file.name,
        		path:savepath,
        		originalName:file.name
        	};
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
			  });
      });
  }
  else
  {

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

}

};

//remove media
exports.removemedia = function(req, res) {
	var article_id = req.params.articleid;
	var article_data = {'media':{}};
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
  var deferred = Q.defer();
	var articleid=req.params.articleid;
	Article.findById(articleid)
	.populate('author','name email fullname')
	.populate('scomments.user','_id fullname following commentvisible')
	.exec(function(err,article){
		if(err){
			console.log(err);
			return res.json(404,err);
		}
		if (!article){
			console.log('notfound');
			return res.send(404);
		}

    console.log(req.params.bot);

		if(article && !req.params.bot)
		{
			return res.json(article);
		}
    else {
      deferred.resolve(article);
    }

	});

  if(req.params.bot){
    return deferred.promise;
  }




};

// show particluar one article
exports.showurl = function(req, res) {
	var deferred = Q.defer(),
		url = req.params.url;
	Article.find({'url':url})
		.populate('author', 'name email fullname')
		.populate('scomments.user', '_id fullname following commentvisible')
		.exec(function(err, article) {
			if (err) {
				console.log(err);
				return res.json(404, err);
			}
			if (!article) {
				console.log('notfound');
				return res.send(404);
			}
			if (article && !req.params.bot) {
				return res.json(article[0]);
			} else {
				deferred.resolve(article[0]);
			}


		});

	if (req.params.bot) {
		return deferred.promise;
	}

};

// show particluar one article
exports.botshow=function(req,res){
	var articleid=req.params.articleid;
	Article.findById(articleid)
	.populate('author','name email fullname')
	.populate('scomments.user','_id fullname following commentvisible')
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
			return article;
		}
		return res.send(403);

	});

};
/** serach that it is exist or not */
exports.search= function(req, res){
  var search = req.params.search;
  var regex = new RegExp(search, 'i');  // 'i' makes it case insensitive
  var q = Article.find({$text:{$search:search}});

  q.where('public').equals(true);
  q.where('hans').equals(true);
  // q.where('searchable').equals(true);

   q.populate('author','name email fullname').exec(function(err,articles) {
    if (err) {
      console.log(err);
      return res.send(404);
    } else {

      return res.json({articles:articles});
    }
  });
};


// show all articles with paging
exports.query = function(req, res) {

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
  //get category name if found data according to category
  if(req.query.category)
  {
    q.where('hanscategory').equals(req.query.category);

  }
  /** public true  */
  q.where('public').equals(true);
  q.where('hans').equals(true);

	/** sorting according to date */

	q.sort('-createdAt');

	/** finally execute */
	q.populate('author','name email fullname').exec(function(err, articles) {
		if (err) {
			console.log(err);
			return res.send(404);
		} else {
			return res.json({articles:articles});
		}
	});


};
// show all hansi articles with paging
exports.hansi = function(req, res) {

	var limit=4;

	var q=Article.find({'author':'5581b46814016a137dc93cdb'});//hansi id
	/** apply limit  */
	q=q.limit(1);

  /** public true  */
  q.where('public').equals(true);
  q.where('hans').equals(true);

	/** sorting according to date */

	q.sort('-createdAt');

	/** finally execute */
	q.populate('author','name email fullname').exec(function(err, articles) {
		if (err) {
			console.log(err);
			return res.send(404);
		} else {
			return res.json({articles:articles});
		}
	});


};
// show all articles with basic info
exports.basic = function(req, res) {

	var q=Article.find({});

	/** sorting according to date */

	q.sort('-createdAt');

	/** finally execute */
		q.populate('author','name email fullname').exec(function(err, articles) {
		if (err) {
			console.log(err);
			return res.send(404);
		} else {
			  for(var i=0; i<articles.length; i++){

            articles[i] = articles[i].articleInfo;
         }
			return res.json({articles:articles});
		}
	});


};

exports.remove = function(req, res) {
	var article_id = req.params.articleid;
	var articleid=req.params.articleid;
	Article.findById(articleid)
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
    fs.unlink('./app/'+article.media.path, function() {
  	  Article.findOneAndRemove({_id: article_id}, function(err, article) {
			if (err) {
				res.json(400, err);
			} else {
				article.remove();
				res.send(200);
		}
	});
	});
}
});
};

/**============Comment Section Start================**/

// get all comments

exports.comment_query=function(req, res){

	var articleid = req.params.articleid;

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
			return res.json(article[0].scomments);
		}

			return res.send(403);

	  });

	};


  // Get Only One comment
  exports.comment_show=function(req, res){
  	var articleid = req.params.articleid,
  	comment_id = req.params.commentid;

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
				var comments=article[0].scomments;
				  for(var i=0; i<comments.length; i++){
	           if(comment_id == comments[i]._id){
	           	return res.json(comments[i]);
	           }
           }
			}

			 return res.send(403);

		  });
  };

  //Create comment
  exports.comment_create=function(req, res){
  	var article_id = req.params.articleid;
  	Article.findByIdAndUpdate(
    article_id,
    {$push: {"scomments": req.body}},
    {safe: true, upsert: true},
     function(err, model) {
        if(err){
        	console.log(err);
        	return res.send(err);
        }
        return res.json(model);
     }
	  );
  };

  //update update comment
  exports.comment_update=function(req, res){
  	var article_id = req.params.articleid,
  	comment_id = req.params.commentid;
  	Article.update({'scomments._id': comment_id}, {'$set': {
    'scomments.$.post': req.body.post,
    'scomments.$.username': req.body.username,
    'scomments.$.user': req.body.user,
	   }}, function(err,model) {
	   	if(err){
        	console.log(err);
        	return res.send(err);
        }
        return res.json(model);
	  });

  };


  //remove comment
  exports.comment_remove=function(req, res){
  	var article_id = req.params.articleid,
  	comment_id = req.params.commentid;

  Article.findByIdAndUpdate(
    article_id,
   { $pull: { 'scomments': {  _id: comment_id } } },function(err,model){
 	   if(err){
        	console.log(err);
        	return res.send(err);
        }
        return res.json(model);
  });

  };

  /**========== Comment Section Stop =================**/
