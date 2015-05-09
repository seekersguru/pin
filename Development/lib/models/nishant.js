'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
 
/**
 * Nishant Schema
 */
var NishnatSchema = new Schema({
  fullname: String,
  email: String,
  location:String
});


// Public profile information
NishnatSchema
  .virtual('profile')
  .get(function() {
    return {
      '_id': this._id,
      'fullname': this.fullname,
      'email' : this.email,
      'location' : this.location
    };
  });


module.exports = mongoose.model('Nishant', NishnatSchema);
