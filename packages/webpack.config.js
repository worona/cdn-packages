var webpack = require('webpack');
var rimraf = require('rimraf');
var path = require('path');
var argv = require('yargs').argv;
var plugins = require('./webpack/plugins');
var output = require('./webpack/output');
var loaders = require('./webpack/loaders');
var current = require('./dist/current.json');
var modulePath = './node_modules/' + current.name;
var packageJson = require(modulePath + '/package.json');
var envs = ['dev', 'prod'];
var config = packageJson.worona;

config.name = packageJson.name;
config.version = packageJson.version;
config.description = packageJson.description;
config.keywords = packageJson.keywords;

module.exports = [];

if (config.type === 'core' && argv.vendors) {
  // We do vendors first:
  config.name = 'vendors-' + config.service + '-worona';
  rimraf.sync(path.resolve('dist', config.name));
  var vendorsConfigs = [];
  envs.forEach(function(env){
    config.env = env;
    var pluginsArr = [
      plugins.definePlugin(config),
      plugins.uglifyJsPlugin(config),
      plugins.dedupePlugin(config),
      plugins.occurrenceOrderPlugin(config),
      plugins.dllPlugin(config),
      plugins.fixModuleIdAndChunkIdPlugin(config),
      plugins.statsWriterPlugin(config),
    ].filter(function(plugin) { return typeof plugin !== 'undefined'; });
    module.exports.push({
      entry: { main: require(modulePath + '/vendors.json') },
      output: output.vendors(config),
      plugins: pluginsArr,
    });
  });

}
else if (config.type === 'core') {
  // Core:
  rimraf.sync(path.resolve('dist', config.name));
  envs.forEach(function(env){
    config.env = env;
    var pluginsArr = [
      plugins.definePlugin(config),
      plugins.uglifyJsPlugin(config),
      plugins.dedupePlugin(config),
      plugins.occurrenceOrderPlugin(config),
      plugins.dllReferencePlugin(config),
      plugins.lodashModuleReplacementPlugin(config),
      plugins.htmlWebpackPlugin(config),
      plugins.statsWriterPlugin(config),
      plugins.copyFaviconPlugin(config),
    ].filter(function(plugin) { return typeof plugin !== 'undefined'; });
    var loadersArr = [
      loaders.ignoreLoader(config),
      loaders.babel(config),
      loaders.css(config),
      loaders.sass(config),
      loaders.image(config),
      loaders.font(config),
      loaders.locale(config),
      loaders.json(config),
    ].filter(function(loader) { return typeof loader !== 'undefined'; });
    module.exports.push({
      entry: { main: [ 'script!systemjs/dist/system.js', modulePath + '/src/index.js' ] },
      output: output.core(config),
      module: { loaders: loadersArr },
      resolve: { extensions: ['', '.js', '.jsx'] },
      postcss: function() { return [require('postcss-cssnext')()]; },
      plugins: pluginsArr,
    });
  });
}
