'use strict';




/* Video Code start part 1*/

//Here comes the video part 
/**
* File Uploading and Streaming with BinaryJS
*/
'use strict';

var BinaryServer, express, http, path, app, video, server, bs;

BinaryServer = require('binaryjs').BinaryServer;
express      = require('express');
http         = require('http');
path         = require('path');
app          = express();
video        = require('./lib/video');

//all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//development only
if ('development' == app.get('env')) {
 app.use(express.errorHandler());
}

/* Video Code start part 1 Ends app*/

/*  Video Code start part 2 # Starts 

server = http.createServer(app);

server.listen(3001, function () {
 console.log('Video Server started on http://0.0.0.0:3001');
});

Video Code start part 2 # Ends */





var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    io = require('socket.io'),
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

/// @RITURAJ COMMENTED FOLLW TO MAKE VIDEO RUN \\\\\
//var app = express();

/// @RITURAJ JUST COMMENT THESE TWO LINES (To make Video Run)\\\\\
// Express settings
require('./lib/config/express')(app);
// Routing
require('./lib/routes')(app);

 var server =http.createServer(app);
 // set up our socket server
var io=require('socket.io').listen(server);
 require('./lib/sockets/base')(io);
 server.listen(config.port, function () {
   console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
 });



// Expose app


exports = module.exports = app;




/* Video Code start part 3 (last) Starts*/
bs = new BinaryServer({ port: 9000 });

bs.on('connection', function (client) {
 client.on('stream', function (stream, meta) {
     switch(meta.event) {
         // list available videos
         case 'list':
             video.list(stream, meta);
             break;

         // request for a video
         case 'request':
             video.request(client, meta);
             break;

         // attempt an upload
         case 'upload':
         default:
             video.upload(stream, meta);
     }
 });
});

/* Video Code start part 3 (last)  Ends*/







