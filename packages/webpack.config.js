var config = require('yargs').argv;
var plugins = require('./build/webpack/plugins');
var output = require('./build/webpack/output');
var loaders = require('./build/webpack/loaders');

switch (config.type) {
  case 'vendors':
    var vendors = require('core-' + config.service + '-worona/vendors.json');
    var pluginsArr = [
      plugins.definePlugin(config),
      plugins.uglifyJsPlugin(config),
      plugins.dedupePlugin(config),
      plugins.occurrenceOrderPlugin(config),
      plugins.dllPlugin(config),
      plugins.fixModuleIdAndChunkIdPlugin(config),
      plugins.statsWriterPlugin(config),
    ].filter(function(plugin) { return typeof plugin !== 'undefined'; });
    module.exports = {
      entry: { main: vendors },
      output: output.vendors(config),
      plugins: pluginsArr,
    };
    break;

  case 'core':
    var pluginsArr = [
      plugins.definePlugin(config),
      plugins.uglifyJsPlugin(config),
      plugins.dedupePlugin(config),
      plugins.occurrenceOrderPlugin(config),
      plugins.dllReferencePlugin(config),
      plugins.lodashModuleReplacementPlugin(config),
      plugins.htmlWebpackPlugin(config),
      plugins.statsWriterPlugin(config),
      plugins.copyFaviconPlugin(config),
    ].filter(function(plugin) { return typeof plugin !== 'undefined'; });
    var loadersArr = [
      loaders.ignoreLoader(config),
      loaders.babel(config),
      loaders.css(config),
      loaders.sass(config),
      loaders.image(config),
      loaders.font(config),
      loaders.locale(config),
      loaders.json(config),
    ].filter(function(loader) { return typeof loader !== 'undefined'; });
    module.exports = {
      entry: { main: [
        'script!systemjs/dist/system.js',
        './node_modules/' + name + '/' + service + '/src/index.js'
      ] },
      output: output.core(config),
      module: { loaders: loadersArr },
      resolve: { extensions: ['', '.js', '.jsx'] },
      postcss: function() { return [require('postcss-cssnext')()]; },
      plugins: pluginsArr,
    };
    break;
}
