import rimraf from 'rimraf';
import { spawn } from 'child-process-promise';
import { writeFileSync } from 'fs';

export default async config => {
  const { name, cdn } = config;
  const envs = [ 'dev', 'prod' ];
  const services = [ 'dashboard', 'app', 'amp', 'fbia' ].filter(service => config[service]);
  if (services.length === 0)
    throw new Error('No service found. Please check the package json.');
  const files = {};
  for (let i = 0; i < services.length; i += 1) {
    for (let j = 0; j < envs.length; j += 1) {
      const service = services[i];
      const env = envs[j];
      await spawn(
        './node_modules/.bin/webpack',
        [
          '--config',
          'webpack.config.js',
          '--progress',
          '--name',
          name,
          '--type',
          config[service].type,
          '--service',
          service,
          '--env',
          env,
          '--cdn',
          cdn,
        ],
        { stdio: 'inherit' },
      );
      files[service] = files[service] || {};
      files[service][env] = require(`../dist/${name}/${service}/${env}/files.json`);
      rimraf.sync(`dist/${name}/${service}/${env}/files.json`);
    }
  }
  writeFileSync(`dist/${name}/files.json`, JSON.stringify(files, null, 2));
  return files;
}
