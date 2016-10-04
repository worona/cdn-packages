var envs = ['dev', 'prod'];
var argv = require('yargs').argv;
var plugins = require('./webpack/plugins');
var output = require('./webpack/output');
var moduleUrl = './node_modules/' + argv.package;
var packageJson = require(moduleUrl + '/package.json');
var name = packageJson.name;
var worona = packageJson.worona;

var options = {
  name: name,
  worona: worona,
};
module.exports = [];

if (worona.type === 'core') {
  // vendors
  var vendors = require(moduleUrl + '/vendors.json');
  envs.forEach(function(env){
    options.env = env;
    module.exports.push({
      entry: { vendors: vendors },
      output: output.vendors(options),
      resolve: { modulesDirectories: [ './node_modules' ] },
      plugins: [
        plugins.dllPlugin(options),
      ],
    });
  });
}
