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
  expert:[  { user: { type: ObjectId, ref: 'User' },
               name:String,
            }],
  location:{ 'address':String,
  'locality':String,
  'sublocality':String,
  'district':String,
  'state':String,
  'country':String,
  'postal-code':String,
  'lat':Number,
  'lng':Number,
  'zoom':Number
  },          
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
      'flag':this.media.path
    };
  });

mongoose.model('Expert', ExpertSchema);
