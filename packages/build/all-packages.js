/* eslint-disable no-console, global-require, import/no-dynamic-require, guard-for-in,
  no-restricted-syntax */
import semver from 'semver';
import { getPackageVersion } from './utils';

export default async ({ force }) => {
  const localPackages = require('../packages.json');

  const outdatedPackages = [];
  for (const name in localPackages) {
    const localVersion = localPackages[name];
    const remoteVersion = await getPackageVersion(name);
    if (semver.gt(remoteVersion, localVersion) || force) {
      outdatedPackages.push({ name, version: remoteVersion });
    } else {
      console.log(`\nPackage '${name}' is already up to date: ${localVersion}.`);
    }
  }
  return outdatedPackages;
};
