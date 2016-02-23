'use strict';

var mongoose = require('mongoose'),
Attachment = mongoose.model('Attachment'),
multipart = require('connect-multiparty'),
fs = require('fs'),
path = require('path'),
_ = require('lodash');


	//create
	exports.create = function(req, res, next) {

	var data = _.pick(req.body, 'type') ,
	uploadPath =  '/uploads';
	req.body.url=req.body.title.trim().replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().split(' ').join('-');
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

			// req.body.tags=JSON.parse(req.body.tags);
        	if(thumb)
        	{
				    fs.rename(tmp_thumbpath, target_thumbpath, function(err) {
			    	if (err) throw err;
			        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
		        fs.unlink(tmp_thumbpath, function() {
			        	if (err) throw err;

		        	var attachment=new Attachment(req.body);
		        	attachment.save(function(err,attachment){
		        		if(err){
		        			console.log(err);
		        			return res.json(400, err);
		        		}
		        		return res.json({attachment:attachment});
		        	});

		        });

		      });


        	}else{

        	var attachment=new Attachment(req.body);
        	attachment.save(function(err,attachment){
        		if(err){
        			console.log(err);
        			return res.json(400, err);
        		}
        		return res.json({attachment:attachment});
        	});

        	}

        });
      });
  }
  else
  {
        	// req.body.tags=req.body.tags;
        	var attachment=new Attachment(req.body);
        	attachment.save(function(err,attachment){
        		if(err){
        			console.log(err);
        			return res.json(400, err);
        		}
        		return res.json({attachment:attachment});
        	});

  }
  };

//update
exports.update = function(req, res) {
	var attachment_id = req.params.attachmentid;
	var attachment_data = req.body;
	delete attachment_data._id;
	delete attachment_data.discovered;
	delete attachment_data.nFavorites;
	delete attachment_data.comments;

	console.log(req.body);
		var uploadPath =  '/uploads';
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

        	attachment_data.mmitags=JSON.parse(req.body.mmitags);
        	attachment_data.tags=JSON.parse(req.body.tags);
        	if(req.body.createdAt)
        	{
        		attachment_data.createdAt= JSON.parse(req.body.createdAt);
       		 }


        	attachment_data.media={
        		extension: file.type,
        		name:file.name,
        		path:savepath,
        		originalName:file.name
        	};
        		if(thumb)
        	{

        	attachment_data.thumblemedia={
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

							Attachment.findOneAndUpdate({_id: attachment_id}, attachment_data, function(err, attachment) {
								if (err) {
									console.log(err);
									return res.json(400, err);
								}
								if (!attachment) {
									console.log('notfound');
									return res.send(404);
								}
								return res.send(200);
							});

		        });

		      });


        	}else{
						Attachment.findOneAndUpdate({_id: attachment_id}, attachment_data, function(err, attachment) {
							if (err) {
								console.log(err);
								return res.json(400, err);
							}
							if (!attachment) {
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

//if we ra emaking attachment as a MMI banner
//then reset all mmibanner field for attachment
// is false this request mainly send by admin section

	if(req.body.banner){
		 Attachment.where({})
			    .update({},{ $set: { mmibanner: false }},{ multi: true},function(){
			    	console.log("mmi banner updated");

		    		Attachment.findOneAndUpdate({_id: attachment_id}, attachment_data, function(err, attachment) {
								if (err) {
									console.log(err);
									return res.json(400, err);
								}
								if (!attachment) {
									console.log('notfound');
									return res.send(404);
								}
								return res.send(200);
							});
			    });

	}else{
	Attachment.findOneAndUpdate({_id: attachment_id}, attachment_data, function(err, attachment) {
		if (err) {
			console.log(err);
			return res.json(400, err);
		}
		if (!attachment) {
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
	var attachment_id = req.params.attachmentid;
	var attachment_data = {'media':{}};

	Attachment.findById(attachment_id)
	.exec(function(err,attachment){
		if(err){
			console.log(err);
			return res.json(404,err);
		}
		if (!attachment){
			console.log('notfound');
			return res.send(404);
		}
		if(attachment)
		{
     fs.unlink('./app/'+attachment.media.path, function() {
				Attachment.findOneAndUpdate({_id: attachment_id}, attachment_data, function(err, attachment) {
		 			if (err) {
					return	res.json(400, err);
					} else {
						// attachment.remove();
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
	var attachment_id = req.params.attachmentid;
	var attachment_data = {'thumblemedia':{}};

	Attachment.findById(attachment_id)
	.exec(function(err,attachment){
		if(err){
			console.log(err);
			return res.json(404,err);
		}
		if (!attachment){
			console.log('notfound');
			return res.send(404);
		}
		if(attachment)
		{
     fs.unlink('./app/'+attachment.thumblemedia.path, function() {
				Attachment.findOneAndUpdate({_id: attachment_id}, attachment_data, function(err, attachment) {
		 			if (err) {
					return	res.json(400, err);
					} else {
						// attachment.remove();
					return res.send(200);
					}
			});
		});

		}
	});

};

// show particluar one attachment
exports.show=function(req,res){
	var attachmentid=req.params.attachmentid;
	Attachment.findById(attachmentid)
	.populate('author','name email')
	.populate('comments.user','_id fullname following commentvisible')
	.exec(function(err,attachment){
		if(err){
			console.log(err);
			return res.json(404,err);
		}
		if (!attachment){
			console.log('notfound');
			return res.send(404);
		}
		if(attachment)
		{
			return res.json(attachment);
		}
		return res.send(403);

	});

};

// show all attachments with paging
exports.query = function(req, res) {

	var limit=req.query.limit;

	var q=Attachment.find({});

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
	q.populate('author','name email').exec(function(err, attachments) {
		if (err) {
			console.log(err);
			return res.send(404);
		} else {
			return res.json({attachments:attachments});
		}
	});


};
// show all attachments with basic info
exports.basic = function(req, res) {
	var q=Attachment.find({}),
     Query ='',
     spiceArray=[];
	/** sorting according to date */
  q.sort('-createdAt');

	/** finally execute */
		q.exec(function(err, attachments) {
		if (err) {
			console.log(err);
			return res.send(404);
		} else {
		  for(var i=0; i < attachments.length; i++){
 
	          attachments[i] = attachments[i].attachmentInfo;
    	    }
        if(spiceArray.length)
        {

          var b = spiceArray.length;
          while (b--) {
                attachments.splice(spiceArray[b], 1);
            }
        }
        Attachment.count({}, function( err, count){

		        return res.json({attachments:attachments,totalElement:count});
        });
		}
  });
};

exports.remove = function(req, res) {
	var attachment_id = req.params.attachmentid;
	var attachmentid=req.params.attachmentid;
	Attachment.findById(attachmentid)
	.exec(function(err,attachment){
		if(err){
			console.log(err);
			return res.json(404,err);
		}
		if (!attachment){
			console.log('notfound');
			return res.send(404);
		}
		if(attachment)
		{
    fs.unlink('./app/'+attachment.media.path, function() {
  	  Attachment.findOneAndRemove({_id: attachment_id}, function(err, attachment) {
			if (err) {
				res.json(400, err);
			} else {
				attachment.remove();
				res.send(200);
		}
	});
	});
}
});
};