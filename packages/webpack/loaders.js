var ExtractTextPlugin = require("extract-text-webpack-plugin");

var babel = function(options) {
  return {
    test: /\.jsx?$/,
    loader: 'babel-loader',
    exclude: /(node_modules)/,
  };
};

var css = function(options) {
  if (options.env === 'dev') {
    return {
      test: /\.css$/,
      loaders: [
        'style-loader',
        'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        'postcss-loader',
      ],
      exclude: /(node_modules)/,
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

var sass = function(options) {
  if (options.env === 'dev') {
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

var image = function(options) {
  return {
    test: /\.(png|jpg|gif)$/,
    loader: 'file-loader?name=images/[name].[hash].[ext]',
    exclude: /(node_modules)/,
  };
}

var font = function(options) {
  return {
    test: /\.(eot|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader?name=fonts/[name].[hash].[ext]',
  };
}

var locale = function(options) {
  return {
    test: /locales\/.+\.json$/,
    loader: 'bundle-loader?name=locales/[name]',
  };
};

var json = function(options) {
  return {
    test: /\.json$/,
    loader: 'json-loader?name=jsons/[name].[hash].[ext]',
    exclude: /(node_modules)/,
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
};
