'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;
    
/**
 * Chat Schema
 */

var ChatSchema = new Schema({
  title: {type:String, required:true},
  topic: { type: String },
  cid: { type: Number },
  comments: [{ from:{
                id:  { type: ObjectId, ref: 'User' },
                name: String,
                },
                to:{
                id:  { type: ObjectId, ref: 'User' },
                name: String,
                }, 
               time: {type: Date, default: Date.now},
               message:String
             }]
});

mongoose.model('Chat', ChatSchema);
