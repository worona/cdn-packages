/* eslint-disable */
var path = require('path');

var packages = function(config) {
  return {
    path: path.resolve('dist'),
    publicPath: 'https://cdn.worona.io/packages/dist/',
    filename: config.name + '/' + config.service + '/' + config.env + '/' + 'js/' + config.name +
      '.[chunkhash].js',
    library: config.name.replace('-', '_'),
    libraryTarget: 'commonjs2',
    hashDigestLength: 32,
    chunkFilename: '[name].[chunkhash].js',
  };
};

var core = function(config) {
  return {
    path: path.resolve('dist'),
    publicPath: 'https://cdn.worona.io/packages/dist/',
    filename: config.name + '/' + config.service + '/' + config.env + '/' + 'js/core-' +
      config.service +
      '.[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    hashDigestLength: 32,
  };
};

var vendors = function(config) {
  return {
    path: path.resolve('dist'),
    filename: config.name + '/' + config.service + '/' + config.env + '/' + 'js/vendors-' +
      config.service +
      '.[chunkhash].js',
    library: 'vendors_' + config.service + '_worona',
    hashDigestLength: 32,
  };
};

module.exports = { core: core, vendors: vendors, packages: packages };
