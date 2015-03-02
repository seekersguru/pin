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

exports.query = function(req, res) {

};
