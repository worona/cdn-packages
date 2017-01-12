import fs from 'fs';
import { spawn } from 'child-process-promise';
import packages from '../packages.json';

export default async ({ name, version }) => {
  await spawn('npm', [ 'install', `${name}@${version}` ], { stdio: 'inherit' });
  packages[name] = version;
  fs.writeFileSync('./packages.json', JSON.stringify(packages, null, 2));
}
