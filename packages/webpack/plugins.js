var webpack = require('webpack');
var path = require('path');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var FixModuleIdAndChunkIdPlugin = require('fix-moduleid-and-chunkid-plugin');

var definePlugin = function(config) {
  var nodeEnv = config.env === 'dev' ? 'development' : 'production';
  return new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify(nodeEnv) } });
};

var lodashModuleReplacementPlugin = function() {
  return new LodashModuleReplacementPlugin({
    currying: true,
    flattening: true,
    placeholders: true,
    collections: true,
  });
};

var uglifyJsPlugin = function(config) {
  if (config.env === 'prod')
    return new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } });
};

var dedupePlugin = function(config) {
  if (config.env === 'prod')
    return new webpack.optimize.DedupePlugin();
};

var occurrenceOrderPlugin = function(config) {
  if (config.env === 'prod')
    return new webpack.optimize.OccurrenceOrderPlugin();
};

var extractTextPlugin = function(config) {
  if (config.env === 'prod')
    return new ExtractTextPlugin('css/[name]/' + config.worona.slug + '.styles.[contenthash].css');
};

var dllReferencePlugin = function(config) {
  return new webpack.DllReferencePlugin({
    context: '../..',
    manifest: require('./' + config.env + '-' + config.entry + '-vendors-manifest.json'),
  });
};

var dllPlugin = function(config) {
  return new webpack.DllPlugin({
    path: path.resolve('dist', config.vendors.name, config.env, 'json', 'vendors-manifest.json'),
    name: 'vendors_' + config.service + '_worona',
  });
};

var fixModuleIdAndChunkIdPlugin = function() {
  return new FixModuleIdAndChunkIdPlugin();
};

var statsWriterPluginVendors = function(config) {
  var env = config.env;
  var service = config.service;
  config.vendors[env] = config.vendors[env] || { files: [], assets: { css: [] }};
  return new StatsWriterPlugin({
    filename: '../worona.json',
    fields: ['chunks'],
    transform: function (data) {
      data.chunks.forEach(function(chunk) {
        chunk.files.forEach(function(file, index) {
          var chunkName = chunk.names[index];
          var vendorsChunk = {
            file: 'dist/' + config.vendors.name + '/' + env + '/' + file,
            filename: /(.+\/)?(.+)$/.exec(file)[2],
            hash: chunk.hash,
          };
          config.vendors[env].main = vendorsChunk;
          config.vendors[env].files.push(vendorsChunk);
        });
      });
      return JSON.stringify(config, null, 2);
    }
  });
};

var statsWriterPlugin = function(config) {
  return new StatsWriterPlugin({
    filename: '../../package.json',
    fields: ['assets', 'chunks'],
    transform: function (data) {
      var worona = config.worona;
      var env = config.env;
      var entry = config.entry;
      var packageJson = config.packageJson;
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
  statsWriterPluginVendors: statsWriterPluginVendors,
  fixModuleIdAndChunkIdPlugin: fixModuleIdAndChunkIdPlugin,
};
