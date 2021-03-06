'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;
    
/**
 * Article Schema
 */
var ArticleSchema = new Schema({
  title: {type:String, required:true},
  author: { type: ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  public: { type: Boolean, default: false },
  mainImage: String,
  discovered: { type: Boolean, default: false, index: true },
  description:{type:String, required:true},
  nFavorites:{ type:Number, default:0},
  tags: [String],
  keywords: [String],
  merchs: {},
  comments: [{ user: { type: ObjectId, ref: 'User' },
               post: String,
               posted: {type: Date, default: Date.now}
             }],
  media:{extension:String,      

               name:String,
                path:String,
                originalName:String
              }
});

mongoose.model('Article', ArticleSchema);
