'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Artwork = mongoose.model('Artwork');

exports.show = function(req, res) {
  var artwork_id = req.params.artworkId;
  var user_id = req.user? req.user._id:null;

  Artwork.findOne({_id: artwork_id}).populate('author', 'username name artworks').exec(function(err, artwork) {
    if (err) {
      console.log(err);
      return res.json(400, err);
    }
    if (!artwork) {
      console.log('notfound');
      return res.send(404);
    }
    if(artwork.public || req.user.role==='admin' || (user_id !== null && artwork.author._id.equals(user_id))) {
      return res.json(artwork);
    }
    return res.send(403);

  });
};
exports.query = function(req, res) {

  if(req.query.admin){
    User.find({ 'role': 'admin' }, { 'favorites' : 1}).limit(1).exec(function(err, user){
        if(err){
          console.log(err);
          return res.send(404);
        }

        var q = Artwork.find({_id : { $in : user[0].favorites}});
        q.populate('author', 'username name photo');
        q.where('public').equals(true);
        q.sort('-nFavorites');

        q.exec(function(err, artworks){
          if(err){
            console.log(err);
            return res.send(404);
          }else{
            return res.json({artworks: artworks});
          }
        });
    });

  }else{
    var merch = req.query.merch;
    var author = req.query.author;
    var q = Artwork.find({   });
    var discovered_only = true;
    if (req.query.showall) {
      if (req.user && req.user.role === 'admin') {
        discovered_only = false;
      } else {
        return res.send(403);
      }
    }

    if (req.query.merch) {
      q = q.where('merchs.'+merch+'.hasObject').equals(true);
    }
    // search category section query
    if (req.query.category) {
      q=q.where('category').in([req.query.category]);
    }

    if(req.query.limit){
      q = q.limit(req.query.limit);
    }
    if (req.query.author) {
      q = q.where('author').equals(author);
    }
    if (req.query.array_fav){
      discovered_only = false;
      if(typeof req.query.array_fav === typeof {}){
        q = q.where('_id').in(req.query.array_fav);
      }
      else{
        q = q.where('_id', req.query.array_fav);
      }
    }else if(req.query.fav_limit){
      return res.json(404);
    }
    if (discovered_only) {
      q = q.where('discovered').equals(true);
    }
    q.populate('author', 'username name photo');
    q.where('public').equals(true);
    q.sort('createdAt');
    q.exec(function(err, artworks) {
      if (err) {
        console.log(err);
        return res.send(404);
      } else {
        return res.json({artworks:artworks});
      }
    });
  }
};
exports.updateDiscovered = function(req, res) {
  var artwork_id = req.params.artworkId;
  var update = {discovered: req.body.discovered};
  console.log(update);
  Artwork.findOneAndUpdate({_id: artwork_id}, update, function(err, artwork){
    if (err) {
      return res.json(400, err);
    }
    if (!artwork) {
      return res.send(404);
    }
    return res.send(200);
  });
};
exports.update = function(req, res) {
  // todo do a check on whho is updating, don't let anyone else update
  var artwork_id = req.params.artworkId;
  var artwork_data = req.body;
  delete artwork_data._id;
  delete artwork_data.discovered;
  delete artwork_data.nFavorite;
  delete artwork_data.author;
  Artwork.findOneAndUpdate({_id: artwork_id, author: req.user._id}, artwork_data, function(err, artwork) {
    if (err) {
      console.log(err);
      return res.json(400, err);
    }
    if (!artwork) {
      console.log('notfound');
      return res.send(404);
    }
    return res.send(200);
  });
};
exports.newArtwork = function(req, res) {
  var artwork = new Artwork({author: req.user._id});
  artwork.createdAt = '';
  return res.json(artwork);
};
exports.create = function(req, res) {
  var new_artwork = new Artwork(req.body);
  var user = req.user;
  new_artwork.author = user._id;
  console.log(new_artwork);
  var count = 0;
  for (var m in new_artwork.merchs) {
    if (new_artwork.merchs[m].hasObject) {
        count++;
        break;
    }
  }
  if(count === 0){
    console.log("rejected");
    return res.json(400, new_artwork);
  }
  new_artwork.save(function(err, artwork){
    if (err) {
      console.log(err);
      return res.json(400, err);
    }
    User.findOneAndUpdate({_id: user._id}, {$push: {'artworks': artwork._id}}, function(err) {
      if(err) res.json(400, err);
      return res.json(artwork);
    });
  });
};

exports.remove = function(req, res) {
  var user = req.user;
  var artwork_id = req.params.artworkId;
  Artwork.findOneAndRemove({_id: artwork_id, author: user._id}, function(err, artwork) {
    if (err) {
      res.json(400, err);
    } else {
      artwork.remove();
      res.send(200);
    }
  });
};
