'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;
    
/**
 * Chat Schema
 */

var DiscussionSchema = new Schema({
  title: {type:String, required:true},
  topic: { type: String },
  cid: { type: Number },
  discussion:[{ from:{
                id:  { type: ObjectId, ref: 'User' },
                name: String,
                },
               time: {type: Date, default: Date.now},
               message:String
             }]           
});

// Public Discussion information
DiscussionSchema
  .virtual('profile')
  .get(function() {
    return {
      '_id': this._id,
      'title': this.title,
      'topic':this.topic,
      'cid': this.cid,
       };
  });


mongoose.model('Discussion', DiscussionSchema);
