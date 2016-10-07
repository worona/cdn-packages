var inquirer = require('inquirer');
var packageJson = require('../package.json');
var semver = require('semver');
var fs = require('fs');
var build = {}

console.log('\n');
inquirer.prompt([{
  type: 'input',
  name: 'name',
  message: 'Which package do you want to install?'
}]).then(function (answers) {
  build.name = answers.name;
  var version = packageJson.dependencies[answers.name];
  var defaultVersion = version ? semver.inc(version, 'patch') : '1.0.0';
  inquirer.prompt([{
    type: 'input',
    name: 'version',
    message: 'Which version do you want to install?',
    default: function () { return defaultVersion; },
  }]).then(function (answers) {
    build.version = answers.version;
    fs.writeFile('dist/current.json', JSON.stringify(build, null, 2), function(err) {
      if(err) throw new Error(err);
    });
    console.log('\n');
  });
});
