var exec = require('child_process').exec;
var current = require('../dist/current.json');
var modulePath = '../node_modules/' + current.name;
var packageJson = require(modulePath + '/package.json');

if (packageJson.worona.type === 'core') {
  console.log('\nBuilding vendors for ' + current.name + '. Please wait...');

  exec('npm run webpack -- --vendors', function(error, stdout, stderr) {
    console.log('\n');
    if (stdout) console.log('WEBPACK: ', stdout);
    if (stderr) console.log('WEBPACK STDERR: ', stderr);
    if (error !== null) {
      console.log('WEBPACK error, stoping here.');
      console.log(error);
      console.log('\n');
    } else {
      console.log('Building succeed.');
      console.log('\n');
    }
  });
}
