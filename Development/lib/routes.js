'use strict';

var index = require('./controllers'),
    users = require('./controllers/users'),
    nishant = require('./controllers/nishant'),
    session = require('./controllers/session'),
    articles = require('./controllers/article'),
    events = require('./controllers/event'),
    discussions = require('./controllers/discussion'),
    familys = require('./controllers/family'), 
    experts = require('./controllers/expert');
   
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

  /**---(',')--article comments section start----(',')---**/

  app.get('/api/comments/:articleid', articles.comment_query);
  app.get('/api/comments/:articleid/:commentid', articles.comment_show);
  app.post('/api/comments/:articleid',  articles.comment_create);
  app.put('/api/comments/:articleid/:commentid', articles.comment_update);
  app.del('/api/comments/:articleid/:commentid', articles.comment_remove);

  /**---(',')--article comments section stop----(',')---**/

  app.post('/api/users', users.create);
  app.get('/api/users', users.query);
  app.put('/api/users/:userid', users.update);
  app.put('/api/users/status/:userid', users.updatestatus);
  app.get('/api/users/checkusername/:username',users.checkusername);
  app.get('/user/:id/verify/:token', users.verifyEmail);
  app.post('/api/users/forgot', users.forgot);
  app.post('/api/users/:id/recover', users.recover);
  

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
  app.post('/api/events',  multipartMiddleware, events.create);
  app.put('/api/events/:articleid', multipartMiddleware,events.update);
  app.del('/api/events/:articleid', events.remove);
  app.put('/api/events/removemedia/:articleid', events.removemedia);

  /**---(',')--Event section stop----(',')---**/

   
  /**---(',')--Event comments section start----(',')---**/
  
  app.get('/api/event-comments/:articleid', events.comment_query);
  app.get('/api/event-comments/:articleid/:commentid', events.comment_show);
  app.post('/api/event-comments/:articleid',  events.comment_create);
  app.put('/api/event-comments/:articleid/:commentid', events.comment_update);
  app.del('/api/event-comments/:articleid/:commentid', events.comment_remove);

  /**---(',')--Event comments section stop----(',')---**/



   
  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);
  app.get('/api/session/facebook', session.fblogin);
  app.get('/api/session/facebook/callback', session.fbcallback);

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
