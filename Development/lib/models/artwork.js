'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

/**
 * Artwork Schema
 */
var ArtworkSchema = new Schema({
  title: {type:String, required:true},
  author: { type: ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  public: { type: Boolean, default: false },
  mainImage: String,
  discovered: { type: Boolean, default: false, index: true },
  description:{type:String, required:true},
  nFavorites:{ type:Number, default:0},
  tags: [String],
  category: [String],
  keywords: [String],
  merchs: {},
  products: {},
  comments: [{ poster: { type: ObjectId, ref: 'User' },
               post: String,
               posted: {type: Date, default: Date.now}
             }]
});


/**
 * Validations
 */
/*ArtworkSchema.path('title')
  .validate(function(name) {
  return name && name.length <= 20;
}, 'Artwork title cannot be greater than 20 charachters');
*/

ArtworkSchema.pre('remove', function(next) {
  this.model('User').update(
    {_id: this.author},
    {$pull: {artworks: this._id}},
    next
  );
});

mongoose.model('Artwork', ArtworkSchema);
