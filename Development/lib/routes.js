'use strict';

var index = require('./controllers'),
    users = require('./controllers/users'),
    nishant = require('./controllers/nishant'),
    session = require('./controllers/session'),
    articles = require('./controllers/article'),
    discussions = require('./controllers/discussion');
   
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
  
  //GET BASIC INFO
  app.get('/api/articles/basic', articles.basic);
  
  // Get Only One
  app.get('/api/articles/:articleid', articles.show);
  
  //Create
  app.post('/api/articles',  multipartMiddleware, articles.create);

  //update
  app.put('/api/articles/:articleid', multipartMiddleware,articles.update);
  
  //remove
  app.del('/api/articles/:articleid', articles.remove);


  //remove media

  app.put('/api/articles/removemedia/:articleid', articles.removemedia);

  /**---(',')--article section stop----(',')---**/

   
  /**---(',')--article comments section start----(',')---**/

  //GET
  app.get('/api/comments/:articleid', articles.comment_query);
  
  // Get Only One
  app.get('/api/comments/:articleid/:commentid', articles.comment_show);
  
  //Create
  app.post('/api/comments/:articleid',  articles.comment_create);

  //update
  app.put('/api/comments/:articleid/:commentid', articles.comment_update);
  
  //remove
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
  app.put('/api/discussions/:discussionid', discussions.update); 
  app.del('/api/discussions/:discussionid', discussions.remove); 
  
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
