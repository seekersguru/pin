'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InviteMeSchema = new Schema({
  email: String,
  name: String
  // createdAt: {type:Date, default: Date.now}
});

// // Validate empty email
// InviteMeSchema
//   .path('email')
//   .validate(function(email) {
//     return email.length;
//   }, 'Email cannot be blank');
// InviteMeSchema
//   .path('name')
//   .validate(function(email) {
//     return email.length;
//   }, 'Name cannot be blank');
// InviteMeSchema
//   .path('email')
//   .validate(function(value, respond) {
//     var self = this;
//     this.constructor.findOne({email: value}, function(err, invite) {
//       if(err) throw err;
//       if(invite) {
//         if(self.id === invite.id) return respond(true);
//         return respond(false);
//       }
//       respond(true);
//     });
// }, 'The specified email address has already requested an invite.');

mongoose.model('InviteMe', InviteMeSchema);
