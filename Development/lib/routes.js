'use strict';

var index = require('./controllers'),
    users = require('./controllers/users'),
    mmiusers = require('./controllers/serviceuser'),
    nishant = require('./controllers/nishant'),
    session = require('./controllers/session'),
    articles = require('./controllers/article'),
    events = require('./controllers/event'),
    discussions = require('./controllers/discussion'),
    familys = require('./controllers/family'),
    experts = require('./controllers/expert'),
    companys = require('./controllers/company'),
    countrycity = require('./controllers/countrycity'),
    attachments = require('./controllers/attachment');

var middleware = require('./middleware');
var multipart = require('connect-multiparty'),
    multipartMiddleware = multipart();

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes

  //nishant section start

  app.post('/api/nishant', nishant.create);
  app.get('/api/nishant', nishant.query);

  //nishant section end

  /**---(',')--article section start----(',')---**/

  //GET
  app.get('/api/articles', articles.query);
  app.get('/api/articles/basic', articles.basic);
  app.get('/api/articles/:articleid', articles.show);
  app.post('/api/articles',  multipartMiddleware, articles.create);
  app.put('/api/articles/:articleid', multipartMiddleware,articles.update);
  app.del('/api/articles/:articleid', articles.remove);
  app.put('/api/articles/removemedia/:articleid', articles.removemedia);
  app.put('/api/articles/removethumble/:articleid', articles.removethumble);
  app.get('/api/articles/search/:search',articles.search);

    //GET
  app.get('/api/attachments', attachments.query);
  app.get('/api/attachments/basic', attachments.basic);
  app.get('/api/attachments/:attachmentid', attachments.show);
  app.post('/api/attachments',  multipartMiddleware, attachments.create);
  app.put('/api/attachments/:attachmentid', multipartMiddleware,attachments.update);
  app.del('/api/attachments/:attachmentid', attachments.remove);
  app.put('/api/attachments/removemedia/:attachmentid', attachments.removemedia);
  app.put('/api/attachments/removethumble/:attachmentid', attachments.removethumble);


  /**---(',')--article comments section start----(',')---**/

  app.get('/api/comments/:articleid', articles.comment_query);
  app.get('/api/comments/:articleid/:commentid', articles.comment_show);
  app.post('/api/comments/:articleid',  articles.comment_create);
  app.put('/api/comments/:articleid/:commentid', articles.comment_update);
  app.del('/api/comments/:articleid/:commentid', articles.comment_remove);

  /**---(',')--article comments section stop----(',')---**/

  app.post('/api/users', users.create);
  app.get('/api/users', users.query);
  app.get('/api/contentexpert', users.contentexpert);
  app.post('/api/users/upload',  multipartMiddleware, users.uploaduser);
  app.get('/api/users/adminrole', users.adminrole);
  app.get('/api/users/:userid', users.show);
  app.put('/api/users/:userid', users.update);
  app.put('/api/users/status/:userid', users.updatestatus);
  app.get('/api/users/checkusername/:username',users.checkusername);
  app.get('/user/:id/verify/:token', users.verifyEmail);
  app.post('/api/users/forgot', users.forgot);
  app.post('/api/users/:id/recover', users.recover);
  app.post('/api/users/connect/:userid', users.connect);
  app.get('/api/users/search/:username/:userid', users.search);
  app.get('/api/users/mycontact/:userid', users.mycontact);
  app.put('/api/users/followingstatus/:followingid', users.connectupdate);

  app.post('/api/mmiusers', mmiusers.create);
  app.get('/api/mmiusers', mmiusers.query);
  app.get('/api/mmiusers/:userid', mmiusers.show);
  app.put('/api/mmiusers/:userid', mmiusers.update);
  app.del('/api/mmiusers/:userid', mmiusers.remove);
  app.put('/api/mmiusers/status/:userid', mmiusers.updatestatus);
  app.get('/api/mmiusers/checkusername/:username',mmiusers.checkusername);
  app.get('/user/:id/verify/:token', mmiusers.verifyEmail);
  app.post('/api/mmiusers/forgot', mmiusers.forgot);
  app.post('/api/mmiusers/:id/recover', mmiusers.recover);
  app.post('/api/mmiusers/connect/:userid', mmiusers.connect);
  app.get('/api/mmiusers/search/:username', mmiusers.search);
  app.del('/api/mmiusers/deletemailusers/:email', mmiusers.deleteEmailWise);
  app.put('/api/mmiusers/followingstatus/:followingid', mmiusers.connectupdate);
  app.post('/api/mmiusers/upload',  multipartMiddleware, mmiusers.uploadusers);



  app.post('/api/discussions', discussions.create);
  app.get('/api/discussions', discussions.query);
  app.get('/api/discussions/:cid', discussions.checkcid);
  app.put('/api/discussions/:discussionid', discussions.update);
  app.del('/api/discussions/:discussionid', discussions.remove);

    /**---(',')--discussion  comments section start----(',')---**/

  app.get('/api/discussion-comments/:discussionid', discussions.comment_query);
  app.get('/api/discussion-comments/:discussionid/:commentid', discussions.comment_show);
  app.post('/api/discussion-comments/:discussionid',  discussions.comment_create);
  app.put('/api/discussion-comments/:discussionid/:commentid', discussions.comment_update);
  app.del('/api/discussion-comments/:discussionid/:commentid', discussions.comment_remove);

  /**---(',')--discussion  comments section stop----(',')---**/


  /**
   * family section apis
   */
  app.post('/api/family', familys.create);
  app.get('/api/family', familys.query);
  app.get('/api/family/:familyid', familys.show);
  app.put('/api/family/:familyid', familys.update);
  app.del('/api/family/:familyid', familys.remove);

  /**
   * experts section apis
   */
  app.post('/api/expert', experts.create);
  app.get('/api/expert', experts.query);
  app.get('/api/expert/basic', experts.basic);
  app.get('/api/expert/:expertid', experts.show);
  app.put('/api/expert/:expertid', experts.update);
  app.del('/api/expert/:expertid', experts.remove);
  app.put('/api/expert/removemedia/:expertid', experts.removemedia);

   /**---(',')--Event section start----(',')---**/

  app.get('/api/events', events.query);
  app.get('/api/events/basic', events.basic);
  app.get('/api/events/:articleid', events.show);
  app.post('/api/events',   events.create);
  app.put('/api/events/:articleid', multipartMiddleware,events.update);
  app.del('/api/events/:articleid', events.remove);
  app.put('/api/events/removemedia/:articleid', events.removemedia);
  app.put('/api/events/register/:eventid', events.register);

  /**---(',')--Event section stop----(',')---**/


  /**---(',')--Event comments section start----(',')---**/

  app.get('/api/event-comments/:articleid', events.comment_query);
  app.get('/api/event-comments/:articleid/:commentid', events.comment_show);
  app.post('/api/event-comments/:articleid',  events.comment_create);
  app.put('/api/event-comments/:articleid/:commentid', events.comment_update);
  app.del('/api/event-comments/:articleid/:commentid', events.comment_remove);

  /**---(',')--Event comments section stop----(',')---**/

  app.get('/api/companys', companys.query);
  app.get('/api/companys/basic', companys.basic);
  app.get('/api/companys/:companyid', companys.show);
  app.post('/api/companys',   companys.create);
  app.put('/api/companys/:companyid',companys.update);
  app.del('/api/companys/:companyid', companys.remove);
  app.post('/api/companys/upload',  multipartMiddleware, companys.uploadcompanies);

  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);
  app.get('/api/session/facebook', session.fblogin);
  app.get('/api/session/facebook/callback', session.fbcallback);


/*** Country city **/


 app.get('/api/countries', countrycity.getCountry);
 app.get('/api/cities/:country', countrycity.getCity);
 app.get('/admin-user-upload',function(req,res){
  res.render('uploadxlsx.html');

 });

  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/partials2/*', index.partials);
  app.get('/old*', middleware.setUserCookie,
          function(req, res) {
            res.render('index', {css: false});
          });
  app.get('/*', middleware.setUserCookie, index.index);
};
