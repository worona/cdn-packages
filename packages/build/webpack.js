import rimraf from 'rimraf';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child-process-promise';

const entryExists = (file) => {
  try {
    fs.accessSync(file, fs.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};

export default async (config) => {
  const { name, type, service } = config;
  const envs = ['dev', 'prod'];
  const entries = (type === 'vendors') ? [service] : ['dashboard', 'app'].filter(entrie =>
    entryExists(path.resolve('node_modules', name, 'src', entrie, 'index.js')));
  if (entries.length === 0) throw new Error('No entry found. Please check the src folder.');
  rimraf.sync(path.resolve('dist', name));
  const files = {};
  for (let i = 0; i < entries.length; i += 1) {
    for (let j = 0; j < envs.length; j += 1) {
      const entrie = entries[i];
      const env = envs[j];
      await spawn('./node_modules/.bin/webpack', ['--config', 'webpack.config.js', '--progress',
        '--name', name,
        '--type', type,
        '--entrie', entrie,
        '--env', env,
      ], { stdio: 'inherit' });
      files[entrie] = files[entrie] || {};
      files[entrie][env] = require(`../dist/${name}/${entrie}/${env}/files.json`);
      rimraf.sync(`dist/${name}/${entrie}/${env}/files.json`);
    }
  }
  fs.writeFileSync(`dist/${name}/worona.json`, JSON.stringify({ ...config, cdn: files }, null, 2));
};
