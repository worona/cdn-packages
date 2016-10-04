var path = require('path');

var packages = function(options) {
  var env = options.env;
  var name = options.name;
  var worona = options.worona;
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

var vendors = function(options) {
  var env = options.env;
  var service = options.worona.service;
  return {
    path: path.resolve('dist', service, env, 'vendors'),
    filename: service + '-vendors.[chunkhash].js',
    library: 'vendors_' + service + '_worona',
    hashDigestLength: 32,
  };
};

module.exports = {
  packages: packages,
  vendors: vendors,
};
