'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;
    
/**
 * Company Schema
 */
var CompanySchema = new Schema({
  title: {type:String, required:true},
  createdAt: { type: Date, default: Date.now },
  public: { type: Boolean, default: false },
  description:{type:String, required:true},
  keywords: [String],
  organization: String,
  url:String,
  address: [{
             street: String,
             city:String,
             state:String,
             country:String,
             pin:String,
             main: { type: Boolean, default: false },
             phone:String
           }],

});

// Basic info to identify the current authenticated user in the app
CompanySchema
  .virtual('companyInfo')
  .get(function() {
    return {
      '_id': this._id,
      'title': this.title,
      'organization':this.organization,
      'address':this.address,
      'url':this.url,
      'createdAt':this.createdAt,
      'approve':this.public
    };
  });

mongoose.model('Company', CompanySchema);
