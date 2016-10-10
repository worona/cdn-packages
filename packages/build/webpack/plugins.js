var webpack = require('webpack');
var path = require('path');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var FixModuleIdAndChunkIdPlugin = require('fix-moduleid-and-chunkid-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

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
    return new ExtractTextPlugin('css/[name]/' + config.slug + '.styles.[contenthash].css');
};

var dllReferencePlugin = function(config) {
  return new webpack.DllReferencePlugin({
    context: '.',
    manifest: require('../dist/vendors-' + config.service + '-worona/' + config.service +
      '/' + config.env + '/json/vendors-manifest.json'),
  });
};

var dllPlugin = function(config) {
  return new webpack.DllPlugin({
    path: path.resolve('dist', config.name, config.service, config.env, 'json', 'vendors-manifest.json'),
    name: 'vendors_' + config.service + '_worona',
  });
};

var fixModuleIdAndChunkIdPlugin = function() {
  return new FixModuleIdAndChunkIdPlugin();
};

var statsWriterPlugin = function(config) {
  var env = config.env;
  var service = config.service;
  config.cdn = config.cdn || {};
  config.cdn[service] = config.cdn[service] || {};
  config.cdn[service][env] = config.cdn[service][env] || { files: [], assets: { css: [] }};
  return new StatsWriterPlugin({
    filename: '../../worona.json',
    fields: ['chunks'],
    transform: function (data) {
      console.log(env);
      data.chunks.forEach(function(chunk) {
        chunk.files.forEach(function(file, index) {
          var vendorsChunk = {
            file: 'dist/' + config.name + '/' + service + '/' + env + '/' + file,
            filename: /(.+\/)?(.+)$/.exec(file)[2],
            hash: chunk.hash,
          };
          if (chunk.names[index] === 'main') config.cdn[service][env].main = vendorsChunk;
          config.cdn[service][env].files.push(vendorsChunk);
        });
      });
      return JSON.stringify(config, null, 2);
    }
  });
};

var htmlWebpackPlugin = function(config) {
  var vendors = require('../dist/vendors-' + config.service + '-worona/worona.json');
  return new HtmlWebpackPlugin({
    filename: 'html/index.html',
    inject: false,
    title: 'Worona Dashboard',
    template: path.resolve('node_modules', config.name, 'html', 'index.html'),
    vendorsFile: 'https://cdn.worona.io/packages/' + vendors.cdn[config.service][config.env].main.file,
    appMountId: 'root',
    window: { __worona__: { prod: (config.env === 'prod'), remote: true } },
    minify: { preserveLineBreaks: true, collapseWhitespace: true },
  });
};

var copyFaviconPlugin = function(config) {
  return new CopyWebpackPlugin([{
    from: 'node_modules/' + config.name + '/html/favicon.png',
    to: 'html/favicon.png'
  }]);
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
  fixModuleIdAndChunkIdPlugin: fixModuleIdAndChunkIdPlugin,
  htmlWebpackPlugin: htmlWebpackPlugin,
  copyFaviconPlugin: copyFaviconPlugin,
};
