'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Article = mongoose.model('Article');


//create
exports.create = function(req, res) {
	var article=new Article(req.body);
	article.save(function(err,article){
	  if(err){
	    console.log(err);
	    return res.json(400, err);
	  } 
	  return res.json({article:article});
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

