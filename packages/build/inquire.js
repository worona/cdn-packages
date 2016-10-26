import inquirer from 'inquirer';
import semver from 'semver';
import packages from '../packages.json';

export default async () => {
  console.log('\n');
  const { name } = await inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'Which package do you want to install?',
  }]);
  const previousVersion = packages[name];
  const defaultVersion = previousVersion ? semver.inc(previousVersion, 'patch') : '1.0.0';
  const { version } = await inquirer.prompt([{
    type: 'input',
    name: 'version',
    message: 'Which version do you want to install?',
    default() { return defaultVersion; },
  }]);
  if (!semver.valid(version)) throw new Error('Invalid version number.');
  console.log('\n');
  return { name, version };
};
