'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;
    
/**
 * Expert Schema
 */
var ExpertSchema = new Schema({
  name: {type:String, required:true},
  designation:String,
  linkedin:String,
  email:String,
  media:{extension:String,      

               name:String,
                path:String,
                originalName:String
              },
    createdAt: { type: Date, default: Date.now }
 });

// Basic info to identify the current authenticated user in the app
ExpertSchema
  .virtual('expertInfo')
  .get(function() {
    return {
      '_id': this._id,
      'name': this.name,
      'designation':this.designation,
      'social':this.social,
      'media':this.media
    };
  });

mongoose.model('Expert', ExpertSchema);
