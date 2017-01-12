import { argv } from 'yargs';
import { merge } from 'lodash';
import inquire from './inquire';
import allPackages from './all-packages';
import install from './install';
import webpack from './webpack';
import save from './save';
import purge from './purge';

const update = async ({ add }) => {
  const packages = add ? [ await inquire() ] : await allPackages({ force: argv.force });
  for (let i = 0; i < packages.length; i += 1) {
    const { name, version } = packages[i];
    console.log(`\nUpdating package ${name} to ${version}. Please wait...\n`);
    await install({ name, version });
    const { worona, description, keywords } = require(`../node_modules/${name}/package.json`);
    const config = { ...worona, name, version, description, keywords };
    const files = await webpack(config);
    await save(merge(config, files));
  }
  if (packages.length > 0)
    await purge();
  console.log('\n');
};

process.on('unhandledRejection', err => {
  console.log(err.stack);
  process.exit(1);
});

update({ add: argv.add });

export default update;
