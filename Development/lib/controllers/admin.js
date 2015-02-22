var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    email = require('../email'),
    ejs = require('ejs');
exports.email = function(req, res) {
  var ids = req.body.ids;
  var email_body = req.body.emailBody;
  User.find({_id : {$in: ids}}, function (err, users) {
    if (err) return res.json(400, err);
    if (users.length === 0) return res.send(404);
    var done = [];
    var not_done = [];
    res.send({willSendTo: users.map(function(u) { return u.name +'<'+u.email+'>'; })});
    users.forEach(function(user) {
      var emailToSend = {
        to: user.name + ' <' + user.email + '>',
        subject: req.body.subject,
        html: ejs.render(email_body, {user:user})
      };
      (new email.Email(emailToSend)).send(function(err, data) {
        if (err) {
          console.log(user._id, err);
          not_done.push([user,err]);
        } else {
          console.log(user._id, data);
          done.push([user,data]);
        }
        if (done.length+not_done.length === users.length) {
          if (req.body.report) {
            var html = 'Done:'+done.length + ' | Not Done:' + not_done.length + '<br>';
            html += done.map(function(rec) {
              var u = rec[0], d = rec[1];
              return u._id + ' ' + u.name + '[' + u.email + ']';
            }).join('<br>');
            (new email.Email({
              to: req.body.report,
              subject: 'Delivery Report:'+req.body.subject,
              html: html
            })).send(console.log);
          }
        }
        return;
      });
    });
  });
};
