'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Article Schema
 */
var AttachmentSchema = new Schema({
  title: {type:String, required:true},
  createdAt: { type: Date, default: Date.now },
  pin: { type: Boolean, default: true },
  money: { type: Boolean, default: true },
  hans: { type: Boolean, default: true },
  mmibanner: { type: Boolean, default: false },
  mainImage: String,
  metadescription:String,
  metatitle:String,
  metakeywords:String,
  media:{extension:String,
         name:String,
         path:String,
         originalName:String
        },
  thumblemedia:{extension:String,
                name:String,
                path:String,
                originalName:String
              },
 url:String           
});

// Basic info to identify the current authenticated user in the app
AttachmentSchema
  .virtual('attachmentInfo')
  .get(function() {
    return {
      '_id': this._id,
      'title': this.title,
      'createdAt':this.createdAt,
      'mmibanner':this.mmibanner,
      'media':this.media,
      'thumblemedia':this.thumblemedia,
    };
  });

mongoose.model('Attachment', AttachmentSchema);
