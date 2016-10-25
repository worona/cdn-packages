/* eslint-disable no-console, global-require, import/no-dynamic-require, guard-for-in,
  no-restricted-syntax */
import request from 'superagent';
import semver from 'semver';

const getPackageVersion = async (name) => {
  const res = await request(`https://registry.npmjs.org/${name}`);
  return res.body['dist-tags'].latest;
};

export default async () => {
  const localPackages = require('../package.json').dependencies;

  const outdatedPackages = [];
  for (const name in localPackages) {
    const localVersion = localPackages[name];
    const remoteVersion = await getPackageVersion(name);
    if (semver.gt(remoteVersion, localVersion)) {
      outdatedPackages.push({ name, version: remoteVersion });
    } else {
      console.log(`\nPackage '${name}' is already up to date: ${localVersion}.`);
    }
  }
  return outdatedPackages;
};
