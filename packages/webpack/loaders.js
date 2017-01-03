/* eslint-disable */
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var ignoreLoader = function(config) {
  return {
    test: /packages\/.+-worona\/src\/(dashboard\/)?index\.js$/,
    loader: 'ignore-loader',
    exclude: new RegExp(config.name),
  };
};

var babel = function(config) {
  return {
    test: /\.jsx?$/,
    loader: 'babel-loader',
    include: new RegExp('node_modules\/' + config.name),
  };
};

var css = function(config) {
  if (config.type === 'core') {
    return {
      test: /\.css$/,
      loaders: [
        'style-loader',
        'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        'postcss-loader',
      ],
    };
  } else {
    return {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', [
        'css-loader?modules',
        'postcss-loader',
      ]),
    };
  }
};

var sass = function(config) {
  if (config.type === 'core') {
    return {
      test: /\.s[ac]ss$/,
      loaders: [
        'style-loader',
        'css-loader',
        'sass-loader',
      ],
    };
  } else {
    return {
      test: /\.s[ac]ss$/,
      loader: ExtractTextPlugin.extract('style-loader', [
        'css-loader',
        'sass-loader',
      ]),
    };
  }
};

var image = function(config) {
  return {
    test: /\.(png|jpg|gif)$/,
    loader: 'file-loader?name=' + config.name + '/' + config.service + '/' + config.env + '/images/[name].[hash].[ext]',
    include: new RegExp('node_modules\/' + config.name),
  };
}

var font = function(config) {
  return {
    test: /\.(eot|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader?name=' + config.name + '/' + config.service + '/' + config.env + '/fonts/[name].[hash].[ext]',
  };
}

var locale = function(config) {
  return {
    test: /locales\/.+\.json$/,
    loader: 'bundle-loader?name=' + config.name + '/' + config.service + '/' + config.env + '/locales/[name]',
    include: new RegExp('node_modules\/' + config.name),
  };
};

var json = function(config) {
  return {
    test: /\.json$/,
    loader: 'json-loader?name=' + config.name + '/' + config.service + '/' + config.env + '/jsons/[name].[hash].[ext]',
    include: new RegExp('node_modules\/' + config.name),
  };
};

module.exports = {
  babel: babel,
  css: css,
  sass: sass,
  image: image,
  font: font,
  locale: locale,
  json: json,
  ignoreLoader: ignoreLoader,
};
