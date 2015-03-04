'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Article = mongoose.model('Article');

exports.create = function(req, res) {
console.log(req.body);

var article=new Article(req.body);
article.save(function(err,article){
  if(err){
    console.log(err);
    return res.json(400, err);
  } 
  return res.json({article:article});
});
};
exports.update = function(req, res) {

var article_id = req.params.articleId;
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

exports.query = function(req, res) {
	 var limit=req.query.limit;

	 var q=Article.find({});
	 /** apply limit  */
	 if(req.query.limit){
	 	q=q.limit(req.query.limit);
	 }

	 /** skip  */
	 if(req.query.pageno){
	 	q=q.skip(req.query.pageno-1);
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
