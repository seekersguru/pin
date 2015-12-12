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
  pin: { type: Boolean, default: true },
  money: { type: Boolean, default: true },
  hans: { type: Boolean, default: true },
  mmibanner: { type: Boolean, default: false },
  mainImage: String,
  discovered: { type: Boolean, default: false, index: true },
  description:{type:String, required:true},
  nFavorites:{ type:Number, default:0},
  tags: [String],
  mmitags: [String],
  keywords: [String],
  category: String,
  hanscategory:String,
  mmicategory:String,
  mmisubcategory:String,
  column:{ type:Number, default:1},
  merchs: {},
  comments: [{ user: { type: ObjectId, ref: 'User' },
               username:String,
               post: String,
               posted: {type: Date, default: Date.now}
             }],
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
 youtubeurl:{ type:String, default:null},
 url:String           
});

// Basic info to identify the current authenticated user in the app
ArticleSchema
  .virtual('articleInfo')
  .get(function() {
    return {
      '_id': this._id,
      'title': this.title,
      'author': this.author.name,
      'tags': this.tags.toString(),
      'comments':this.comments.length,
      'createdAt':this.createdAt,
      'category':this.category,
      'approve':this.public,
      'pin':this.pin,
      'money':this.money,
      'hans':this.hans,
      'mmibanner':this.mmibanner,
      'media':this.media,
      'thumblemedia':this.thumblemedia,
      'youtubeurl':this.youtubeurl
    };
  });

mongoose.model('Article', ArticleSchema);
