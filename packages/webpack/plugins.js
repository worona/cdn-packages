/* eslint-disable */
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
    return new ExtractTextPlugin('css/' + config.name + '.[contenthash].css');
};

var dllReferencePlugin = function(config) {
  return new webpack.DllReferencePlugin({
    context: '.',
    manifest: require('../dist/vendors-' + config.entrie + '-worona/' + config.entrie +
      '/' + config.env + '/json/manifest.json'),
  });
};

var dllPlugin = function(config) {
  return new webpack.DllPlugin({
    path: path.resolve('dist', config.name, config.entrie, config.env, 'json', 'manifest.json'),
    name: 'vendors_' + config.entrie + '_worona',
  });
};

var fixModuleIdAndChunkIdPlugin = function() {
  return new FixModuleIdAndChunkIdPlugin();
};

var contextReplacementPlugin = function() {
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|es/);
}

var statsWriterPlugin = function(config) {
  var output = { files: [] };
  return new StatsWriterPlugin({
    filename: 'files.json',
    fields: ['assets', 'chunks'],
    transform: function (data) {
      data.assets.forEach(function(asset) {
        if (asset.name !== 'html/index.html') {
          var hash;
          try {
            hash = /\.([a-z0-9]{32})\.\w+?$/.exec(asset.name)[1];
            type = /^(\w+)\//.exec(asset.name)[1];
          } catch (error) {
            throw new Error('Hash or type couldn\'t be extracted from ' + asset.name);
          }
          var filepath = 'dist/' + config.name + '/' + config.entrie + '/' + config.env + '/' + asset.name;
          if (type === 'css') {
            output.assets = output.assets || {};
            output.assets[type] = output.assets[type] || [];
            output.assets[type].push(filepath);
          }
          output.files.push({
            file: filepath,
            filename: /(.+\/)?(.+)$/.exec(asset.name)[2],
            hash: hash,
          });
        }
      });
      data.chunks.forEach(function(chunk) {
        chunk.files.forEach(function(file, index) {
          if (chunk.names[index] === 'main')
            output.main = {
              file: 'dist/' + config.name + '/' + config.entrie + '/' + config.env + '/' + file,
              filename: /(.+\/)?(.+)$/.exec(file)[2],
              hash: chunk.hash,
            };
        });
      });
      return JSON.stringify(output, null, 2);
    }
  });
};

var htmlWebpackPlugin = function(config) {
  var worona = require('../dist/vendors-' + config.entrie + '-worona/worona.json')
  var vendors = worona.cdn[config.entrie][config.env].main.file;
  return new HtmlWebpackPlugin({
    filename: 'html/index.html',
    inject: false,
    title: 'Worona Dashboard',
    template: path.resolve('node_modules', config.name, 'html', 'index.html'),
    vendorsFile: 'https://cdn.worona.io/packages/' + vendors,
    appMountId: 'root',
    window: {
      publicPath: 'https://cdn.worona.io/',
      __worona__: { prod: (config.env === 'prod'), remote: true },
    },
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
  contextReplacementPlugin: contextReplacementPlugin,
};
