var path = require('path');
var rimraf = require('rimraf');

var packages = function(config) {
  var env = config.env;
  var name = config.name;
  var worona = config.worona;
  return {
    path: path.resolve('dist', env),
    publicPath: 'https://cdn.worona.io/packages/' + name + '/dist/' + env + '/',
    filename: 'js/[name]-' + worona.slug + '.' + worona.service + '.' + worona.type + '.[chunkhash].js',
    library: worona.slug + '_' + worona.service + '_' + worona.type,
    libraryTarget: 'commonjs2',
    hashDigestLength: 32,
    chunkFilename: '[name].[chunkhash].js',
  };
};

var core = function(config) {
  var service = config.worona.service;
  var corePath = 'dist/' + service + '/' + config.env + '/core-' + service + '-worona';
  rimraf.sync(path.resolve(corePath));
  return {
    path: path.resolve(corePath),
    publicPath: 'https://cdn.worona.io/packages/' + corePath,
    filename: 'js/' + service + '-core.[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    hashDigestLength: 32,
  };
};

var vendors = function(config) {
  rimraf.sync(path.resolve('dist', config.vendors.name));
  return {
    path: path.resolve('dist', config.vendors.name, config.env),
    filename: 'js/vendors-' + config.service + '.[chunkhash].js',
    library: 'vendors_' + config.service + '_worona',
    hashDigestLength: 32,
  };
};

module.exports = {
  core: core,
  vendors: vendors,
  packages: packages,
};
