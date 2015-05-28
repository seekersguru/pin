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
  services:String,
  keywords: [String],
  organization: String,
  firmsupertype: String,
  firmtype: String,
  firmsubtype: String,
  roletype: [],
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
  pin: { type: Boolean, default: true },
  money: { type: Boolean, default: true },         

});

// Basic info to identify the current authenticated user in the app
CompanySchema
  .virtual('companyInfo')
  .get(function() {
    return {
      '_id': this._id,
      'title': this.title,
      'organization':this.organization,
      'firmsupertype':this.firmsupertype,
      'firmtype':this.firmtype,
      'firmsubtype':this.firmsubtype,
      'address':this.address,
      'url':this.url,
      'createdAt':this.createdAt,
      'approve':this.public
    };
  });

mongoose.model('Company', CompanySchema);
