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
  subtopic: { type: String },
  cid: { type: Number },
  authorpin: { type: ObjectId, ref: 'User' },
  authormmi: { type: ObjectId, ref: 'Serviceuser' },
  comments: [{ user: { type: ObjectId, ref: 'User' },
               username:String,
               post: String,
               posted: {type: Date, default: Date.now}
             }],

  scomments: [{ user: { type: ObjectId, ref: 'Serviceuser' },
               username:String,
               post: String,
               posted: {type: Date, default: Date.now}
             }],
  pin: { type: Boolean, default: false},           
  money: { type: Boolean, default: false},
  createdAt: { type: Date, default: Date.now },
  
});

// Public Discussion information
DiscussionSchema
  .virtual('profile')
  .get(function() {
    return {
      '_id': this._id,
      'title': this.title,
      'topic':this.topic,
      'subtopic':this.subtopic,
      'cid': this.cid,
       };
  });


mongoose.model('Discussion', DiscussionSchema);
