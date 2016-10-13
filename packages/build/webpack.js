import rimraf from 'rimraf';
import path from 'path';
import fs from 'fs';
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
  const entries = (type === 'vendors') ? [service] : ['dashboard', 'app'].filter(entrie =>
    entryExists(path.resolve('node_modules', name, entrie, 'src', 'index.js')));

  clean(path.resolve('dist', name));

  for (var i = 0; i < entries.length; i++) {
    for (var j = 0; j < envs.length; j++) {
      await spawn('./node_modules/.bin/webpack', ['--config', 'webpack.config.js', '--progress',
        '--name', name,
        '--type', type,
        '--service', service,
        '--entrie', entries[i],
        '--env', envs[j],
      ], { stdio:'inherit' });
    }
  }
};
