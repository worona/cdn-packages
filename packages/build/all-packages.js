/* eslint-disable no-console, global-require, import/no-dynamic-require, guard-for-in,
  no-restricted-syntax */
import Registry from 'npm-registry';
import semver from 'semver';

const npm = new Registry({ registry: 'https://registry.npmjs.org/' });

const getPackageVersion = name => new Promise((resolve, reject) => {
  npm.packages.get(name, (err, data) => {
    if (err) reject(err);
    else resolve(data[0].version);
  });
});

export default async () => {
  const localPackages = require('../package.json').dependencies;

  const outdatedPackages = [];
  for (const name in localPackages) {
    const localVersion = localPackages[name];
    const remoteVersion = await getPackageVersion(name);
    if (semver.gt(localVersion, remoteVersion)) {
      outdatedPackages.push({ name, version: remoteVersion });
    }
  }
  return outdatedPackages;
};
