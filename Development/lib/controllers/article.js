'use strict';

var mongoose = require('mongoose'),
User = mongoose.model('User'),
Article = mongoose.model('Article'),
multipart = require('connect-multiparty'),
fs = require('fs'),
path = require('path'),
_ = require('lodash'),
count=0;
// moment=require('moment');

Article.collection.ensureIndex({title: 'text', description: 'text', tags: 'text', mmitags: 'text', category: 'text', mmicategory: 'text', mmisubcategory: 'text'}, function(error) {console.log("get index");});

/** serach that it is exist or not */
exports.search= function(req, res){
  var search = req.params.search;
  var regex = new RegExp(search, 'i');  // 'i' makes it case insensitive
  var q = Article.find({$text:{$search:search}});

  q.where('public').equals(true);
  // q.where('searchable').equals(true);

   q.populate('author','name email').exec(function(err,articles) {
    if (err) {
      console.log(err);
      return res.send(404);
    } else {

      return res.json({articles:articles});
    }
  });
};



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
	// if(req.body.createdAt)
	// {	console.log(req.body.createdAt);
	// 	req.body.createdAt=moment(req.body.createdAt).calendar();
	//     console.log(req.body.createdAt);

	// }

	if(req.files && req.files.file)
	{

		var file =" ",
		thumb="";
		file = req.files.file;

	if( Object.prototype.toString.call( req.files.file ) === '[object Array]' ) {

		file = req.files.file[0];
		thumb=req.files.file[1];

	var originalThumbName=Date.now()+path.extname(thumb.name),
	   tmp_thumbpath = thumb.path,
     target_thumbpath = './app/uploads/' + originalThumbName,
     savepaththumb='uploads/' + originalThumbName;
	}

	var extension=path.extname(file.name);

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

        	if(thumb)
        	{

        	req.body.thumblemedia={
        		extension: thumb.type,
        		name:thumb.name,
        		path:savepaththumb,
        		originalName:thumb.name
        	};


        	}


        	req.body.mmitags=JSON.parse(req.body.mmitags);
        	req.body.tags=JSON.parse(req.body.tags);
        	req.body.createdAt=JSON.parse(req.body.createdAt);

        	console.log(req.body);
        	// req.body.tags=JSON.parse(req.body.tags);
        	if(thumb)
        	{
				    fs.rename(tmp_thumbpath, target_thumbpath, function(err) {
			    	if (err) throw err;
			        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
		        fs.unlink(tmp_thumbpath, function() {
			        	if (err) throw err;

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


        	}else{

        	var article=new Article(req.body);
        	article.save(function(err,article){
        		if(err){
        			console.log(err);
        			return res.json(400, err);
        		}
        		return res.json({article:article});
        	});

        	}

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
	delete article_data.comments;

	console.log(req.body);
		var data = _.pick(req.body, 'type') ,
	uploadPath =  '/uploads';
	console.log(req.files);
	if(req.files && req.files.file)
	{

		var file =" ",
		thumb="";
		file = req.files.file;

	if( Object.prototype.toString.call( req.files.file ) === '[object Array]' ) {

		file = req.files.file[0];
		thumb=req.files.file[1];

	var originalThumbName=Date.now()+path.extname(thumb.name),
	   tmp_thumbpath = thumb.path,
     target_thumbpath = './app/uploads/' + originalThumbName,
     savepaththumb='uploads/' + originalThumbName;
	}

	var extension=path.extname(file.name);

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

        	article_data.mmitags=JSON.parse(req.body.mmitags);
        	article_data.tags=JSON.parse(req.body.tags);
        	if(req.body.createdAt)
        	{
        		article_data.createdAt= JSON.parse(req.body.createdAt);
       		 }


        	article_data.media={
        		extension: file.type,
        		name:file.name,
        		path:savepath,
        		originalName:file.name
        	};
        		if(thumb)
        	{

        	article_data.thumblemedia={
        		extension: thumb.type,
        		name:thumb.name,
        		path:savepaththumb,
        		originalName:thumb.name
        	};


        	}


					if(thumb)
        	{
				    fs.rename(tmp_thumbpath, target_thumbpath, function(err) {
			    	if (err) throw err;
			        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
		        fs.unlink(tmp_thumbpath, function() {
			        	if (err) throw err;

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


        	}else{
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
			  });
      });
  }
  else
  {

//if we ra emaking article as a MMI banner
//then reset all mmibanner field for article
// is false this request mainly send by admin section

	if(req.body.banner){
		 Article.where({})
			    .update({},{ $set: { mmibanner: false }},{ multi: true},function(){
			    	console.log("mmi banner updated");

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

	}else{
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


}

};

//remove media
exports.removemedia = function(req, res) {
	var article_id = req.params.articleid;
	var article_data = {'media':{}};

	Article.findById(article_id)
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
				Article.findOneAndUpdate({_id: article_id}, article_data, function(err, article) {
		 			if (err) {
					return	res.json(400, err);
					} else {
						// article.remove();
					return res.send(200);
					}
			});
		});

		// return res.send(200);

		}
	});

};

//remove media
exports.removethumble = function(req, res) {
	var article_id = req.params.articleid;
	var article_data = {'thumblemedia':{}};

	Article.findById(article_id)
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
     fs.unlink('./app/'+article.thumblemedia.path, function() {
				Article.findOneAndUpdate({_id: article_id}, article_data, function(err, article) {
		 			if (err) {
					return	res.json(400, err);
					} else {
						// article.remove();
					return res.send(200);
					}
			});
		});

		}
	});

};

// show particluar one article
exports.show=function(req,res){
	var articleid=req.params.articleid;
	Article.findById(articleid)
	.populate('author','name email')
	.populate('comments.user','_id fullname following commentvisible')
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
			return res.json(article);
		}
		return res.send(403);

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

  /** public true  */
  q.where('public').equals(true);
  q.where('pin').equals(true);
  /** sorting according to date */


	q.sort('-createdAt');

	/** finally execute */
	q.populate('author','name email').exec(function(err, articles) {
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
	var q=Article.find({}),
     Query ='',
     spiceArray=[];
	/** sorting according to date */
  q.sort('-createdAt');

  if(req.query && req.query.filter){
    Query=JSON.parse(req.query.filter);

    if(Query.approve)
    {
        q.where('public').equals(Query.approve);
    }

    if(Query.type === 'image'){
      q.where('media').ne(null);
      q.where('thumblemedia').equals(null);
      q.where('youtubeurl').equals(null);
      

    }
    
    if(Query.type === 'video'){
      q.where('media').ne(null);
      q.where('thumblemedia').ne(null);
      q.where('youtubeurl').equals(null);

    }

    if(Query.type === 'youtube'){
      q.where('youtubeurl').ne(null);
    }


    else if(Query.type === 'text'){
      q.where('media').equals(null);

    }

    if(Query.createdAt && Query.createdAt.startDate && Query.createdAt.endDate){
    console.log(Query);
     q.where({createdAt: {$gte:  Query.createdAt.startDate,$lte: Query.createdAt.endDate}});

    }

  }
  q.populate('author','name email');

	/** finally execute */
		q.exec(function(err, articles) {
		if (err) {
			console.log(err);
			return res.send(404);
		} else {
			  for(var i=0; i < articles.length; i++){

          if(Query && Query.author){
            if(Query.author !== articles[i].articleInfo.author){
              spiceArray.push(i);
            }
          }
          articles[i] = articles[i].articleInfo;
        }
        console.log(spiceArray);
        if(spiceArray.length)
        {

          var b = spiceArray.length;
          while (b--) {
                articles.splice(spiceArray[b], 1);
            }
        }
        Article.count({}, function( err, count){

		        return res.json({articles:articles,totalElement:count});
        })
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
			return res.json(article[0].comments);
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
				var comments=article[0].comments;
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
    {$push: {"comments": req.body}},
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
  	Article.update({'comments._id': comment_id}, {'$set': {
    'comments.$.post': req.body.post,
    'comments.$.username': req.body.username,
    'comments.$.user': req.body.user,
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
   { $pull: { 'comments': {  _id: comment_id } } },function(err,model){
 	   if(err){
        	console.log(err);
        	return res.send(err);
        }
        return res.json(model);
  });

  };

  /**========== Comment Section Stop =================**/
