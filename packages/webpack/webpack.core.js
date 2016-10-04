var path = require('path');
var webpack = require('webpack');
var argv = require('yargs').argv;
var StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
var entries = require('./webpack-entries');
var loaders = require('./webpack-loaders');
var plugins = require('./webpack-plugins');
var output = require('./webpack-output');

module.exports = function(packageJson) {
  var worona = packageJson.worona = packageJson.worona || {};
  var entriesArr = argv.entry ? [argv.entry] : entries();

  return entriesArr.map(function(entry) {
    var options = {
      env: argv.env,
      entry: entry,
      worona: worona,
      packageJson: packageJson,
    }

    var loadersArr = [
      loaders.babel(options),
      loaders.css(options),
      loaders.sass(options),
      loaders.image(options),
      loaders.font(options),
      loaders.locale(options),
      loaders.json(options),
    ].filter(function(loader) { return typeof loader !== 'undefined'; });

    var pluginsArr = [
      plugins.definePlugin(options),
      plugins.lodashModuleReplacementPlugin(options),
      plugins.uglifyJsPlugin(options),
      plugins.dedupePlugin(options),
      plugins.occurrenceOrderPlugin(options),
      plugins.extractTextPlugin(options),
      plugins.dllReferencePlugin(options),
      plugins.statsWriterPlugin(options),
    ].filter(function(plugin) { return typeof plugin !== 'undefined'; });

    return {
      entry: { [entry]: path.resolve('src', entry, 'index.js') },
      output: output(options),
      module: { loaders: loadersArr },
      resolve: { extensions: ['', '.js', '.jsx'] },
      postcss: function() { return [require('postcss-cssnext')()]; },
      stats: { children: false },
      plugins: pluginsArr,
    };
  });
};
