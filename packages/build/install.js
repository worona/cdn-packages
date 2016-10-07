var exec = require('child_process').exec;
var current = require('../dist/current.json');

var packageName = current.name + '@' + current.version;

console.log('\nInstalling ' + packageName + '. Please wait...');

exec('npm install --save --save-exact ' + packageName, function(error, stdout, stderr) {
  console.log('\n');
  if (stdout) console.log('NPM: ', stdout);
  if (stderr) console.log('NPM STDERR: ', stderr);
  if (error !== null) {
    console.log('NPM error, stoping here.');
    console.log(error);
    console.log('\n');
  } else {
    console.log('Installation succeed.');
    console.log('\n');
  }
});
