'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;
    
/**
 * Family Schema
 */
var FamilySchema = new Schema({
    name: {type:String, required:true},
    createdAt: { type: Date, default: Date.now }
 });

// Basic info to identify the current authenticated user in the app
FamilySchema
  .virtual('familyInfo')
  .get(function() {
    return {
      '_id': this._id,
      'name': this.title,
    };
  });

mongoose.model('Family', FamilySchema);
