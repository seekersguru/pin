'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('Serviceuser'),
  Event = mongoose.model('Event'),
  multipart = require('connect-multiparty'),
  fs = require('fs'),
  path = require('path'),
  Q = require('q'),
  _ = require('lodash');


/**
 * Create file upload
 */
exports.upload = function(req, res, next) {
  var data = _.pick(req.body, 'type'),
    uploadPath = path.normalize(cfg.data + '/uploads'),
    file = req.files.file;
  console.log(file.name); //original name (ie: sunset.png)
  console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)
  console.log(uploadPath); //uploads directory: (ie: /home/user/data/uploads)
};


//create
exports.create = function(req, res, next) {

  var data = _.pick(req.body, 'type'),
    uploadPath = '/uploads';
  console.log(req.files);
  if (req.files && req.files.file) {

    var file = req.files.file,
      extension = path.extname(file.name);

    var originalName = Date.now() + extension;
    // get the temporary location of the file
    var tmp_path = file.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './app/uploads/' + originalName,
      savepath = 'uploads/' + originalName;


    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
      // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
      fs.unlink(tmp_path, function() {
        if (err) throw err;
        console.log('File uploaded to: ' + target_path + ' - ' + file
          .size + ' bytes');

        req.body.media = {
          extension: file.type,
          name: file.name,
          path: savepath,
          originalName: file.name
        };
        req.body.expert = JSON.parse(req.body.expert);
        req.body.location = JSON.parse(req.body.location);
        req.body.eventdate = JSON.parse(req.body.eventdate);
        console.log(req.body);
        var article = new Event(req.body);
        article.save(function(err, article) {
          if (err) {
            console.log(err);
            return res.json(400, err);
          }
          return res.json({
            article: article
          });
        });

      });
    });
  } else {
    console.log(req.body);
    // req.body.tags=req.body.tags;
    var article = new Event(req.body);
    article.save(function(err, article) {
      if (err) {
        console.log(err);
        return res.json(400, err);
      }
      return res.json({
        article: article
      });
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
  delete article_data.comments;

  console.log(article_data);
  var data = _.pick(req.body, 'type'),
    uploadPath = '/uploads';

  if (req.files && req.files.file) {

    var file = req.files.file,
      extension = path.extname(file.name);

    var originalName = Date.now() + extension;
    // get the temporary location of the file
    var tmp_path = file.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './app/uploads/' + originalName,
      savepath = 'uploads/' + originalName;


    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
      // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
      fs.unlink(tmp_path, function() {
        if (err) throw err;
        console.log('File uploaded to: ' + target_path + ' - ' + file
          .size + ' bytes');

        article_data.media = {
          extension: file.type,
          name: file.name,
          path: savepath,
          originalName: file.name
        };

        article_data.expert = JSON.parse(article_data.expert);
        article_data.location = JSON.parse(article_data.location);
        article_data.eventdate = JSON.parse(article_data.eventdate);

        Event.findOneAndUpdate({
          _id: article_id
        }, article_data, function(err, article) {
          if (err) {
            console.log(err);
            return res.json(400, err);
          }
          if (!article) {
            console.log('notfound');
            return res.send(404);
          }
          return res.json({
            article: article
          });
        });
      });
    });
  } else {

    Event.findOneAndUpdate({
      _id: article_id
    }, article_data, function(err, article) {
      if (err) {
        console.log(err);
        return res.json(400, err);
      }
      if (!article) {
        console.log('notfound');
        return res.send(404);
      }
      return res.json({
        article: article
      });
    });

  }

};

//remove media
exports.removemedia = function(req, res) {
  var article_id = req.params.articleid;
  var article_data = {
    'media': {}
  };
  Event.findOneAndUpdate({
    _id: article_id
  }, article_data, function(err, article) {
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
exports.show = function(req, res) {
  var deferred = Q.defer(),
      articleid = req.params.articleid;
  Event.findById(articleid).populate('author', 'name email')
    .exec(function(err, article) {
      if (err) {
        console.log(err);
        return res.json(404, err);
      }
      if (!article) {
        console.log('notfound');
        return res.send(404);
      }

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

// show all articles with paging
exports.query = function(req, res) {

  var limit = req.query.limit;

  var q = Event.find({});
  /** apply limit  */
  if (req.query.limit) {
    q = q.limit(req.query.limit);
  }

  /** skip  */
  if (req.query.pageno) {
    q = q.skip((req.query.pageno - 1) * req.query.limit);
  }

  /** public true  */
  q.where('public').equals(true);
  q.where('money').equals(true);

  /** sorting according to date */

  q.sort('eventdate');

  /** finally execute */
  q.populate('author', 'name email').exec(function(err, articles) {
    if (err) {
      console.log(err);
      return res.send(404);
    } else {
      return res.json({
        articles: articles
      });
    }
  });


};
// show all articles with basic info
exports.basic = function(req, res) {

  var q = Event.find({});
  q.where('money').equals(true);
  q.where('public').equals(true);

  /** sorting according to date */

  q.sort('eventdate');

  /** finally execute */
  q.populate('author', 'name email').exec(function(err, articles) {
    if (err) {
      console.log(err);
      return res.send(404);
    } else {
      for (var i = 0; i < articles.length; i++) {

        articles[i] = articles[i].eventInfo;
      }
      return res.json({
        articles: articles
      });
    }
  });


};

exports.remove = function(req, res) {
  var article_id = req.params.articleid;
  var articleid = req.params.articleid;
  Event.findById(articleid)
    .exec(function(err, article) {
      if (err) {
        console.log(err);
        return res.json(404, err);
      }
      if (!article) {
        console.log('notfound');
        return res.send(404);
      }
      if (article) {
        fs.unlink('./app/' + article.media.path, function() {
          Event.findOneAndRemove({
            _id: article_id
          }, function(err, article) {
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

//Create comment
exports.register = function(req, res) {
  var article_id = req.params.eventid;
  Event.findByIdAndUpdate(
    article_id, {
      $push: {
        "serviceregistered": req.body.user
      }
    }, {
      safe: true,
      upsert: true
    },
    function(err, model) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      return res.json(model);
    }
  );
};

/**============Comment Section Start================**/

// get all comments

exports.comment_query = function(req, res) {

  var articleid = req.params.articleid;

  Event.find({
      _id: articleid
    })
    .exec(function(err, article) {
      if (err) {
        console.log(err);
        return res.json(404, err);
      }
      if (!article) {
        console.log('notfound');
        return res.send(404);
      }
      if (article) {
        return res.json(article[0].comments);
      }

      return res.send(403);

    });

};


// Get Only One comment
exports.comment_show = function(req, res) {
  var articleid = req.params.articleid,
    comment_id = req.params.commentid;

  Event.find({
      _id: articleid
    })
    .exec(function(err, article) {
      if (err) {
        console.log(err);
        return res.json(404, err);
      }
      if (!article) {
        console.log('notfound');
        return res.send(404);
      }
      if (article) {
        var comments = article[0].comments;
        for (var i = 0; i < comments.length; i++) {
          if (comment_id == comments[i]._id) {
            return res.json(comments[i]);
          }
        }
      }

      return res.send(403);

    });
};

//Create comment
exports.comment_create = function(req, res) {
  var article_id = req.params.articleid;
  Event.findByIdAndUpdate(
    article_id, {
      $push: {
        "comments": req.body
      }
    }, {
      safe: true,
      upsert: true
    },
    function(err, model) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      return res.json(model);
    }
  );
};

//update update comment
exports.comment_update = function(req, res) {
  var article_id = req.params.articleid,
    comment_id = req.params.commentid;
  Event.update({
    'comments._id': comment_id
  }, {
    '$set': {
      'comments.$.post': req.body.post,
      'comments.$.username': req.body.username,
      'comments.$.user': req.body.user,
    }
  }, function(err, model) {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    return res.json(model);
  });

};

//remove comment
exports.comment_remove = function(req, res) {
  var article_id = req.params.articleid,
    comment_id = req.params.commentid;

  Event.findByIdAndUpdate(
    article_id, {
      $pull: {
        'comments': {
          _id: comment_id
        }
      }
    },
    function(err, model) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      return res.json(model);
    });

};

/**========== Comment Section Stop =================**/
