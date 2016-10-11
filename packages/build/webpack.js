import rimraf from 'rimraf';
import path from 'path';
import { spawn } from 'child-process-promise';

const clean = path => new Promise((resolve, reject) =>
  rimraf(path, error => {
    if (error) reject(error)
    else resolve(true);
  }));

const entryExists = path => {
  try {
    fs.accessSync(path, fs.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};

export default async ({ name, type, service }) => {
  const envs = ['dev', 'prod'];
  const entries = (type === 'vendors') ? [service] : ['dashboard', 'app'].filter(entry =>
      entryExists(path.resolve('node_modules', name, entry, 'src', 'index.js')));

  clean(path.resolve('dist', name));

  entries.forEach(entrie => envs.forEach(async env => {
    await spawn('./node_modules/.bin/webpack', ['--config', 'webpack.config.js', '--progress',
      '--name', name,
      '--type', type,
      '--service', service,
      '--entrie', entrie,
      '--env', env,
    ], { stdio:'inherit' });
  }));
};
