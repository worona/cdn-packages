var inquirer = require('inquirer');
var packageJson = require('../package.json');
var semver = require('semver');

export default async () => {
  console.log('\n');
  const { name } = await inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'Which package do you want to install?'
  }]);
  const previousVersion = packageJson.dependencies[name];
  const defaultVersion = previousVersion ? semver.inc(previousVersion, 'patch') : '1.0.0';
  const { version } = await inquirer.prompt([{
    type: 'input',
    name: 'version',
    message: 'Which version do you want to install?',
    default: function () { return defaultVersion; },
  }]);
  if (!semver.valid(version)) throw new Error('Invalid version number.');
  console.log('\n');
  return { name, version };
};
