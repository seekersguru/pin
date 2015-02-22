/**
 * Migration framework.
 * You can write migration scripts them using this script
 * the following way
 * : node migrate.js migration_script.js
 * The format of migration script is as follow:
 *     module.exports = function (mongoose, config, cb) {}
 * This function takes mongoose object and config and run
 * queries which  are needed for migration, it callbacks cb with
 * first argument as err if any or null otherwise
 * Node that the script should be idempotent i.e. running it
 * multiple times shoudn't have any adverse affect 
 **/
var path = require('path'),
    fs = require('fs');
if (process.argv.length !== 3) {
  console.log('usage: node ' + __filename.split('/').pop() +  ' <migration_script>');
  process.exit(1);
}
var mongoose = require('mongoose');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var configPath = '../lib/config/config',
	config = require(path.join(__dirname, configPath));
mongoose.connect(config.mongo.uri, config.mongo.options);

var modelsPath = path.join(__dirname, ('../lib/models'));

fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});
require('./'+process.argv.pop())(mongoose, config, function(err) {
  if (err) throw err;
  console.log('Finished');
  mongoose.disconnect();
});
