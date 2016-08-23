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
  authortype: {type: String, default: 'user', 'enum' : ['user','serviceuser']},
  createdAt: { type: Date, default: Date.now },
  public: { type: Boolean, default: false },
  mainImage: String,
  discovered: { type: Boolean, default: false, index: true },
  description:{type:String, required:true},
  nFavorites:{ type:Number, default:0},
  tags: [String],
  keywords: [String],
  category: String,
  canonical:String,
  mmicategory:String,
  mmisubcategory:String,
  merchs: {},
  // comments: [{ user: { type: ObjectId, ref: 'User' },
  //              username:String,
  //              post: String,
  //              posted: {type: Date, default: Date.now}
  //            }],  
  scomments: [{ user: { type: ObjectId, ref: 'Serviceuser' },
               username:String,
               post: String,
               posted: {type: Date, default: Date.now}
             }],
  media:{extension:String,      

               name:String,
                path:String,
                originalName:String
              } ,
 youtubeurl:String,
 url:String,
 metadescription:String,
 metakeywords:String,
 metatitle:String

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
      'comments':this.scomments.length,
      'createdAt':this.createdAt,
      'url':this.url,
      'category':this.category,
      'approve':this.public
    };
  });

mongoose.model('Article', ArticleSchema);
