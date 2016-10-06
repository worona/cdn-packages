var envs = ['dev', 'prod'];
var argv = require('yargs').argv;
var plugins = require('./webpack/plugins');
var output = require('./webpack/output');
var modulePath = './node_modules/' + argv.package;
var packageJson = require(modulePath + '/package.json');
var config = packageJson.worona;

config.name = packageJson.name;
config.version = packageJson.version;
config.description = packageJson.description;
config.keywords = packageJson.keywords;

module.exports = [];

if (config.type === 'core') {
  // Vendors:
  config.vendors = { name: 'vendors-' + config.service + '-worona' };
  envs.forEach(function(env){
    config.env = env;
    var pluginsArr = [
      plugins.definePlugin(config),
      plugins.uglifyJsPlugin(config),
      plugins.dedupePlugin(config),
      plugins.occurrenceOrderPlugin(config),
      plugins.dllPlugin(config),
      plugins.fixModuleIdAndChunkIdPlugin(config),
      plugins.statsWriterPluginVendors(config),
    ].filter(function(plugin) { return typeof plugin !== 'undefined'; });
    module.exports.push({
      entry: { vendors: require(modulePath + '/vendors.json') },
      output: output.vendors(config),
      plugins: pluginsArr,
    });
  });
  // Core:
  // envs.forEach(function(env){
  //   worona.env = env;
  //   var pluginsArr = [
  //     plugins.definePlugin(options),
  //     plugins.uglifyJsPlugin(options),
  //     plugins.dedupePlugin(options),
  //     plugins.occurrenceOrderPlugin(options),
  //   ].filter(function(plugin) { return typeof plugin !== 'undefined'; });
  //   module.exports.push({
  //     entry: { core: [ 'script!systemjs/dist/system.js', modulePath + '/src/index.js' ] },
  //     output: output.core(options),
  //     plugins: pluginsArr,
  //   });
  // });
}
