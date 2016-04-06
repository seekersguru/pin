'use strict';

var express, http, path, app,  server;

// BinaryServer = require('binaryjs').BinaryServer;
express      = require('express');
http         = require('http');
path         = require('path');
app          = express();
// video        = require('./lib/video');

//all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//app.use(app.router);

//development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    //io = require('socket.io'),
    http = require('http'),
    mongoose = require('mongoose');


/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.FB_APP_ID=703341096418077;
process.env.FB_APP_SECRET="523d6510a56672ae230d91910085612c";

// Application Config
var config = require('./lib/config/config');
config['facebook']['id']=703341096418077;
config['facebook']['secret']="523d6510a56672ae230d91910085612c";
config["port"]=3000;
// Connect to database
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});


// Populate empty DB with sample data
// require('./lib/config/dummydata');
    // }));

// Passport Configuration
var passport = require('./lib/config/passport');

// Express settings
require('./lib/config/express')(app);
// Routing
require('./lib/routes')(app);


var  io = require('socket.io'),
 server = http.createServer(app),
 io = io.listen(server),
 favicon = require('static-favicon'),
 logger = require('morgan'),
 cookieParser = require('cookie-parser'),
 bodyParser = require('body-parser');


//set up our socket server
require('./sockets/base')(io);

//start the server
server.listen(config.port);

//optional - set socket.io logging level
io.set('log level', 1000);



//middleware settings
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
var err = new Error('Not Found');
err.status = 404;
next(err);
});

/// error handlers

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
app.use(function (err, req, res, next) {
 res.status(err.status || 500);
 res.render('error', {
   message: err.message,
   error: err
 });
});
}

//production error handler
//no stacktraces leaked to user
app.use(function (err, req, res, next) {
res.status(err.status || 500);
res.render('error', {
 message: err.message,
 error: {}
});
});


exports = module.exports = app;
