var config = require('yargs').argv;
var plugins = require('./build/webpack/plugins');
var output = require('./build/webpack/output');
var loaders = require('./build/webpack/loaders');


console.log(require('./webpack.config.js'));
console.log('\n\n');

var pluginsArr = [
  plugins.definePlugin(config),
  plugins.uglifyJsPlugin(config),
  plugins.dedupePlugin(config),
  plugins.occurrenceOrderPlugin(config),
  plugins.dllPlugin(config),
  plugins.fixModuleIdAndChunkIdPlugin(config),
  plugins.statsWriterPlugin(config),
].filter(function(plugin) { return typeof plugin !== 'undefined'; });
console.log({
  entry: { main: require('./node_modules/core-' + config.service + '-worona/vendors.json') },
  output: output.vendors(config),
  plugins: pluginsArr,
});
