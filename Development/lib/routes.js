'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    // s3upload = require('./controllers/s3upload'),
    artwork = require('./controllers/artwork'),
    session = require('./controllers/session'),
    contactus = require('./controllers/contactus'),
    inviteme = require('./controllers/inviteme'),
    orders = require('./controllers/orders'),
    admin = require('./controllers/admin'),
    cod = require('./controllers/cod');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.get('/api/search/:word', api.search);
  app.get('/api/category/:categoryname', api.category);

  app.post('/api/awesomeThings', api.awesomeThings);
  app.get('/api/awesomeThings', api.awesomeThings);

  // app.get('/api/upload/sign', middleware.auth, s3upload.signUpload);
  // app.get('/api/upload/signGetUrl', middleware.adminAuth, s3upload.signS3Url);
  // app.get('/api/upload/done', middleware.auth, s3upload.uploadDone);

  app.get('/api/artwork/new', middleware.auth, artwork.newArtwork);
  app.get('/api/artwork', artwork.query);
  app.get('/api/artwork/:artworkId', artwork.show);
  app.put('/api/artwork/:artworkId/discovered', middleware.adminAuth, artwork.updateDiscovered);
  app.put('/api/artwork/:artworkId', middleware.auth, artwork.update);
  app.del('/api/artwork/:artworkId',middleware.auth, artwork.remove);
  app.post('/api/artwork', middleware.auth, artwork.create);

  app.post('/api/users', users.create);
  app.get('/api/users', users.query);
  app.post('/api/users/inviteMe', users.inviteMe);
  app.post('/api/users/:id/recover', users.recover);
  app.post('/api/users/forgot', users.forgot);
  app.put('/api/users/:id/password', middleware.auth, users.changePassword);
  app.put('/api/users/:id', middleware.auth, users.update);
  app.get('/api/users/me', middleware.auth, users.me);
  app.put('/api/users/favorite/:action', middleware.auth, users.favorite);
  app.put('/api/users/following/:action', middleware.auth, users.follow);
  app.get('/user/:id/verify/:token', users.verifyEmail);
  app.get('/api/users/:id', users.show);
  app.post('/api/users/resend', users.resend);

  app.post('/api/orders/callback', orders.callback);
  app.get('/api/orders/callback', orders.callback);
  app.post('/api/orders/sign', orders.sign);
  app.get('/api/orders/:oid', orders.show);
  app.put('/api/orders/:id', orders.update);
  app.post('/api/orders', orders.create);
  app.get('/api/orders', orders.query);
  app.post('/api/cod/available', cod.codAvailable);
  app.post('/api/cod/codGateway', cod.codGateway);
  app.get('/api/users/:id/sales', users.sales);

  app.get('/api/users/sales/all', users.getAllUsersWithSale);

  app.post('/api/contactus', contactus.addQuery);
  app.post('/api/invitefriends', inviteme.inviteFriends);

  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);
  app.get('/api/session/facebook', session.fblogin);
  app.get('/api/session/facebook/callback', session.fbcallback);

  app.post('/api/admin/email', middleware.adminAuth, admin.email);
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
