var argv = require('yargs').argv;
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var current = require('../dist/current.json');
var modulePath = '../node_modules/' + current.name;
var packageJson = require(modulePath + '/package.json');
var env = ['dev', 'prod'];
var shell = require('shelljs');

spawn('npm', ['run', 'webpack'], { stdio:'inherit' });


if (packageJson.worona.type === 'core') {
  console.log('\nBuilding vendors for ' + current.name + '. Please wait...');

  var webpack = exec('npm run webpack -- --vendors --env dev --ansi', function(error, stdout, stderr) {
    // console.log('\n');
    // if (stdout) console.log('WEBPACK: ', stdout);
    // if (stderr) console.log('WEBPACK STDERR: ', stderr);
    // if (error !== null) {
    //   throw new Error(error);
    // } else {
    //   console.log('Build succeed.');
    //   console.log('\n');
    // }
  });
  webpack.stdout.on('data', function(data) {
    console.log(data);
});
}
