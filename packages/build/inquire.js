import inquirer from 'inquirer';
import semver from 'semver';
import { getPackageVersion } from './utils';

export default async () => {
  console.log('\n');
  const { name } = await inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'Which package do you want to install?',
  }]);
  const latestVersion = await getPackageVersion(name);
  const { version } = await inquirer.prompt([{
    type: 'input',
    name: 'version',
    message: 'Which version do you want to install?',
    default() { return latestVersion; },
  }]);
  if (!semver.valid(version)) throw new Error('Invalid version number.');
  console.log('\n');
  return { name, version };
};
