var webpack = require('webpack');
var path = require('path');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var definePlugin = function(options) {
  var nodeEnv = options.env === 'dev' ? 'development' : 'production';
  return new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify(nodeEnv) } });
};

var lodashModuleReplacementPlugin = function(options) {
  return new LodashModuleReplacementPlugin({
    currying: true,
    flattening: true,
    placeholders: true,
    collections: true,
  });
};

var uglifyJsPlugin = function(options) {
  if (options.env === 'prod')
    return new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } });
};

var dedupePlugin = function(options) {
  if (options.env === 'prod')
    return new webpack.optimize.DedupePlugin();
};

var occurrenceOrderPlugin = function(options) {
  if (options.env === 'prod')
    return new webpack.optimize.OccurrenceOrderPlugin();
};

var extractTextPlugin = function(options) {
  if (options.env === 'prod')
    return new ExtractTextPlugin('css/[name]/' + options.worona.slug + '.styles.[contenthash].css');
};

var dllReferencePlugin = function(options) {
  return new webpack.DllReferencePlugin({
    context: '../..',
    manifest: require('./' + options.env + '-' + options.entry + '-vendors-manifest.json'),
  });
};

var dllPlugin = function(options) {
  var env = options.env;
  var service = options.worona.service;
  return new webpack.DllPlugin({
    path: path.resolve('dist', service, env, 'vendors', 'vendors-manifest.json'),
    name: 'vendors_' + service + '_worona',
    context: path.resolve('..', '..', '..'),
  });
};

var statsWriterPlugin = function(options) {
  return new StatsWriterPlugin({
    filename: '../../package.json',
    fields: ['assets', 'chunks'],
    transform: function (data) {
      var worona = options.worona;
      var env = options.env;
      var entry = options.entry;
      var packageJson = options.packageJson;
      worona[entry] = worona[entry] || {};
      worona[entry][env] = worona[entry][env] || {};
      worona[entry][env].files = [];
      worona[entry][env].assets = {};
      data.assets.forEach(function(asset) {
        var hash;
        try {
          hash = /\.([a-z0-9]{32})\.\w+?$/.exec(asset.name)[1];
          type = /^(\w+)\//.exec(asset.name)[1];
        } catch (error) {
          throw new Error('Hash or type couldn\'t be extracted from ' + asset.name);
        }
        if (type === 'css') {
          worona[entry][env].assets[type] = worona[entry][env].assets[type] || [];
          worona[entry][env].assets[type].push(packageJson.name + '/dist/' + env + '/' + asset.name);
        }
        worona[entry][env].files.push({
          file: packageJson.name + '/dist/' + env + '/' + asset.name,
          hash: hash,
        });
      });
      data.chunks.forEach(function(chunk) {
        chunk.files.forEach(function(file, index) {
          if (chunk.names[index] === 'main') {
            worona[entry][env].main = packageJson.name + '/dist/' + env + '/' + file;
          }
        });
      });
      return JSON.stringify(packageJson, null, 2);
    }
  });
};



module.exports = {
  definePlugin: definePlugin,
  lodashModuleReplacementPlugin: lodashModuleReplacementPlugin,
  uglifyJsPlugin: uglifyJsPlugin,
  dedupePlugin: dedupePlugin,
  occurrenceOrderPlugin: occurrenceOrderPlugin,
  extractTextPlugin: extractTextPlugin,
  dllReferencePlugin: dllReferencePlugin,
  dllPlugin: dllPlugin,
  statsWriterPlugin: statsWriterPlugin,
};
