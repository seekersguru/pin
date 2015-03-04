'use strict';

var index = require('./controllers'),
    users = require('./controllers/users'),
    nishant = require('./controllers/nishant'),
    session = require('./controllers/session'),
    articles = require('./controllers/article');
   
var middleware = require('./middleware');

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

  //Create
  app.post('/api/articles', articles.create);

  
  /**---(',')--article section stop----(',')---**/


  app.post('/api/users', users.create);
  app.get('/api/users', users.query);
  
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
