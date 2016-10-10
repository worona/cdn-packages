import webpack from 'webpack';
import rimraf from 'rimraf';
import path from 'path';
import plugins from './webpack/plugins';
import output from './webpack/output';
import loaders from './webpack/loaders';

const clean = path => new Promise((resolve, reject) => {
  rimraf(path, error => if(error) reject(error) else resolve(true));
});

export default async (config) => {
  const { name } = config;
  clean(path.resolve('dist', config.name));
  
  config.env = argv.env;
  const pluginsArr = [
    plugins.definePlugin(config),
    plugins.uglifyJsPlugin(config),
    plugins.dedupePlugin(config),
    plugins.occurrenceOrderPlugin(config),
    plugins.dllPlugin(config),
    plugins.fixModuleIdAndChunkIdPlugin(config),
    plugins.statsWriterPlugin(config),
  ].filter(function(plugin) { return typeof plugin !== 'undefined'; });
  module.exports = {
    entry: { main: require(modulePath + '/vendors.json') },
    output: output.vendors(config),
    plugins: pluginsArr,
  };
};

if (config.type === 'core' && argv.vendors) {
  // We do vendors first:
  config.name = 'vendors-' + config.service + '-worona';
  rimraf.sync(path.resolve('dist', config.name));
  config.env = argv.env;
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
    entry: { main: require(modulePath + '/vendors.json') },
    output: output.vendors(config),
    plugins: pluginsArr,
  };

}
else if (config.type === 'core') {
  // Core:
  rimraf.sync(path.resolve('dist', config.name));
  envs.forEach(function(env){
    config.env = env;
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
    module.exports.push({
      entry: { main: [ 'script!systemjs/dist/system.js', modulePath + '/src/index.js' ] },
      output: output.core(config),
      module: { loaders: loadersArr },
      resolve: { extensions: ['', '.js', '.jsx'] },
      postcss: function() { return [require('postcss-cssnext')()]; },
      plugins: pluginsArr,
    });
  });
}
