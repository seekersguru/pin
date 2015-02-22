'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ContactUsSchema = new Schema({
	name:String,
	email:String,
	message:String,
	createdAt: {type:Date, default: Date.now}
});

module.exports = mongoose.model('ContactUs', ContactUsSchema);