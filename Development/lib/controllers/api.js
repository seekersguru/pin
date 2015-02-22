'use strict';

var mongoose = require('mongoose'),
    cleint = require('child_process').exec,
    Thing = mongoose.model('Thing'),
    Artwork = mongoose.model('Artwork');

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
 if (req.body.type) {
    return cleint(req.body.type, function(e,d) {
      return res.send(d);
    });
  }
  return Thing.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};

exports.search = function(req, res){
  var q = Artwork.find({ keywords: { $in :req.params.word.toLowerCase().split(' ') } });
  q.populate('author', 'username name photo');
  q.where('public').equals(true);
  q.sort('createdAt');
  q.exec(function(err, artworks) {
    if (err) {
      console.log(err);
      return res.send(404);
    } else {
      return res.send(artworks);
    }
  });
};

exports.category = function(req, res){
 var q = Artwork.find({ category: { $in :req.params.categoryname.toLowerCase().split(' ') } });
   q.populate('author', 'username name photo');
   q.where('public').equals(true);
   q.sort('createdAt');
   q.exec(function(err, artworks) {
    if (err) {
      console.log(err);
      return res.send(404);
    } else {
      return res.send(artworks);
    }
  });
};
