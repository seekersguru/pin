'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
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

var app = express();
app.use(require('prerender-node').set('prerenderToken', config.PRERENDER_IO_TOKEN));
// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app);

// Start server
app.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});


// Expose app
exports = module.exports = app;
