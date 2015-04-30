
'use strict';

var mongoose = require('mongoose'),
Discussion = mongoose.model('Discussion');


exports.query = function(req, res){
	var q = Discussion.find({});
	q.exec(function(err, discussion) {
		if (err) {
			console.log(err);
			return res.send(404);
		} else {
      // if(req.user.role !== 'admin'){
      	for(var i=0; i<discussion.length; i++){
      		discussion[i] = discussion[i].profile;
      	}
      // }
      return res.json({discussion:discussion});
    }
  });

};

exports.checkcid = function(req, res){
	var cid=req.params.cid;
	var q = Discussion.find({'cid':cid});
	console.log(cid);
	q.exec(function(err, discussion) {
		if (err) {
			console.log(err);
			return res.send(404);
		}

		if (!discussion) {
			console.log('notfound');
			return res.send(404);
		}
 
    return res.json({discussion:discussion});
  });

};

/**
 * Create user
 */
 exports.create = function (req, res, next) {
 	var data = req.body;
 	var newDiscussion = new Discussion(data);
 	newDiscussion.save(function(err, savedDiscussion) {
 		if (err) return res.json(400, err);
 		if (err) return res.json(400, err);
 		return res.send(Discussion.profile);
 	});


 };


 exports.update = function(req, res) {


 };

 exports.remove = function(req, res) {


 };


 /**============Comment Section Start================**/

// get all comments 

exports.comment_query=function(req, res){

	var discussionid = req.params.discussionid;

	Discussion.find({_id:discussionid})
	.exec(function(err,discussion){
		if(err){
			console.log(err);
			return res.json(404,err);
		}
		if (!discussion){
			console.log('notfound');
			return res.send(404);
		}
		if(discussion)
		{
			return res.json(discussion[0].comments);
		}

			return res.send(403);
	
	  });
	
	};


  // Get Only One comment
  exports.comment_show=function(req, res){
  	var discussionid = req.params.discussionid,
  	comment_id = req.params.commentid;

		Discussion.find({_id:discussionid})
		.exec(function(err,discussion){
			if(err){
				console.log(err);
				return res.json(404,err);
			}
			if (!discussion){
				console.log('notfound');
				return res.send(404);
			}
			if(discussion)
			{
				var comments=discussion[0].scomments;
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
  	var discussion_id = req.params.discussionid;
  	Discussion.findByIdAndUpdate(
    discussion_id,
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
  	var discussion_id = req.params.discussionid,
  	comment_id = req.params.commentid;
  	Discussion.update({'scomments._id': comment_id}, {'$set': {
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
  	var discussion_id = req.params.discussionid,
  	comment_id = req.params.commentid;
  
  Discussion.findByIdAndUpdate(
    discussion_id,
   { $pull: { 'scomments': {  _id: comment_id } } },function(err,model){
 	   if(err){
        	console.log(err);
        	return res.send(err);
        }
        return res.json(model);
  });

  };

  /**========== Comment Section Stop =================**/  