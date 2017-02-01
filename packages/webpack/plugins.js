/* eslint-disable */
var webpack = require('webpack');
var path = require('path');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
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
  if (
    config.env === 'prod' || config.name === 'bulma-dashboard-theme-worona' ||
      config.name === 'publish-native-app-extension-worona' ||
      config.name === 'general-app-extension-worona' ||
      config.name === 'wp-org-connection-app-extension-worona'
  )
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
  return new ExtractTextPlugin(
    config.name + '/' + config.service + '/' + config.env + '/css/' + config.name +
      '.[contenthash].css'
  );
};

var dllReferencePlugin = function(config) {
  return new webpack.DllReferencePlugin({
    context: '.',
    manifest: require(
      '../dist/vendors-' + config.service + '-worona/' + config.service + '/' + config.env +
        '/json/manifest.json'
    ),
  });
};

var dllPlugin = function(config) {
  return new webpack.DllPlugin({
    path: path.resolve('dist', config.name, config.service, config.env, 'json', 'manifest.json'),
    name: 'vendors_' + config.service + '_worona',
  });
};

var fixModuleIdAndChunkIdPlugin = function() {
  return new FixModuleIdAndChunkIdPlugin();
};

var contextReplacementPlugin = function() {
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|es/);
};

var statsWriterPlugin = function(config) {
  var output = { files: [] };
  return new StatsWriterPlugin({
    filename: config.name + '/' + config.service + '/' + config.env + '/files.json',
    fields: [ 'assets', 'chunks' ],
    transform: function(data) {
      data.assets.forEach(function(asset) {
        if (!/html\/((cordova|pwa)\/)?index\.html/.test(asset.name)) {
          var hash = /\.([a-z0-9]{32})\.\w+?$/.exec(asset.name)[1];
          var type = /.+\/(\w+)\//.exec(asset.name)[1];
          var filename = /(.+\/)?(.+)$/.exec(asset.name)[2];
          var filepath = 'dist/' + asset.name;
          if (type === 'css') {
            output.assets = output.assets || {};
            output.assets[type] = output.assets[type] || [];
            output.assets[type].push(filepath);
          }
          output.files.push({ file: filepath, filename: filename, hash: hash });
        }
      });
      data.chunks.forEach(function(chunk) {
        chunk.files.forEach(function(file, index) {
          if (chunk.names[index] === 'main')
            output.main = {
              file: 'dist/' + file,
              filename: /(.+\/)?(.+)$/.exec(file)[2],
              hash: chunk.hash,
            };
        });
      });
      return JSON.stringify(output, null, 2);
    },
  });
};

var generateHtmlWebpack = function(config, name) {
  var worona = require('../dist/vendors-' + config.service + '-worona/files.json');
  var vendors = worona[config.service][config.env].main.file;
  var title = 'Worona ' + config.service[0].toUpperCase() + config.service.slice(1);
  return new HtmlWebpackPlugin({
    filename: config.name + '/' + config.service + '/' + config.env + '/html/' + name + '/index.html',
    inject: false,
    title: title,
    template: path.resolve('node_modules', config.name, 'html', name, 'index.html'),
    vendorsFile: 'https://cdn.worona.io/packages/' + vendors,
    appMountId: 'root',
    window: {
      publicPath: 'https://cdn.worona.io/packages/dist/',
      __worona__: { prod: config.env === 'prod', remote: true },
    },
    minify: { preserveLineBreaks: true, collapseWhitespace: true },
  });
};

var htmlWebpackPlugin = function(config) {
  if (config.service === 'dashboard') {
    return generateHtmlWebpack(config, '');
  }
}

var htmlWebpackPluginCordova = function(config) {
  if (config.service === 'app') {
    return generateHtmlWebpack(config, 'cordova');
  }
}

var htmlWebpackPluginPwa = function(config) {
  if (config.service === 'app') {
    return generateHtmlWebpack(config, 'pwa');
  }
}

var copyFaviconPlugin = function(config) {
  return new CopyWebpackPlugin([
    {
      from: 'node_modules/' + config.name + '/html/favicon.png',
      to: config.name + '/' + config.service + '/' + config.env + '/html/favicon.png',
    },
  ]);
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
  htmlWebpackPluginCordova: htmlWebpackPluginCordova,
  htmlWebpackPluginPwa: htmlWebpackPluginPwa,
  copyFaviconPlugin: copyFaviconPlugin,
  contextReplacementPlugin: contextReplacementPlugin,
};
