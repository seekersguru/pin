'use strict';

// define globals
var express = require('express'),
    io = require('socket.io'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    io = io.listen(server),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

// set up our JSON API for later
//require('./routes/api')(app);

// set up our socket server
require('./sockets/base')(io);

// start the server
server.listen(3003);

// optional - set socket.io logging level
io.set('log level', 1000);



// middleware settings
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

//@Rituraj Commented as public is not relevant we working for angular 
//app.use(require('stylus').middleware(path.join(__dirname, 'public')));

// for production
//app.use(express.static(__dirname +  '/public'));

// for development purposes, access during
// iterative development as /angular-dev
// see below if you want to add back the development env
app.use('/angular-dev', express.static(__dirname  + '/angular-frontend/app'));

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
