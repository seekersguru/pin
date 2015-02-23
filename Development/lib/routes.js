'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session');
   
var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.post('/api/users', users.create);
  app.get('/api/users', users.query);
  app.post('/api/users/:id/recover', users.recover);
  app.post('/api/users/forgot', users.forgot);
  app.put('/api/users/:id/password', middleware.auth, users.changePassword);
  app.put('/api/users/:id', middleware.auth, users.update);
  app.get('/api/users/me', middleware.auth, users.me);
  app.put('/api/users/following/:action', middleware.auth, users.follow);
  app.get('/user/:id/verify/:token', users.verifyEmail);
  app.get('/api/users/:id', users.show);
  app.post('/api/users/resend', users.resend);
  

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
