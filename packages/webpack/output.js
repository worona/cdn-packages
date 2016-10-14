var path = require('path');

var packages = function(config) {
  var env = config.env;
  var name = config.name;
  var worona = config.worona;
  return {
    path: path.resolve('dist', env),
    publicPath: 'https://cdn.worona.io/packages/' + name + '/dist/' + env + '/',
    filename: 'js/[name]-' + worona.slug + '.' + worona.entrie + '.' + worona.type + '.[chunkhash].js',
    library: worona.slug + '_' + worona.entrie + '_' + worona.type,
    libraryTarget: 'commonjs2',
    hashDigestLength: 32,
    chunkFilename: '[name].[chunkhash].js',
  };
};

var core = function(config) {
  return {
    path: path.resolve('dist', config.name, config.entrie, config.env),
    publicPath: 'https://cdn.worona.io/packages/dist/' + config.name + '/' + config.entrie + '/' + config.env,
    filename: 'js/core-' + config.entrie + '.[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    hashDigestLength: 32,
  };
};

var vendors = function(config) {
  return {
    path: path.resolve('dist', config.name, config.entrie, config.env),
    filename: 'js/vendors-' + config.entrie + '.[chunkhash].js',
    library: 'vendors_' + config.entrie + '_worona',
    hashDigestLength: 32,
  };
};

module.exports = {
  core: core,
  vendors: vendors,
  packages: packages,
};
