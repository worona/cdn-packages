import { argv } from 'yargs';
import inquire from './inquire';
import allPackages from './all-packages';
import install from './install';
import webpack from './webpack';
import save from './save';
import purge from './purge';

const update = async ({ one }) => {
  const packages = one ? [await inquire()] : await allPackages();
  for (let i = 0; i < packages.length; i += 1) {
    const { name, version } = packages[i];
    console.log(`\nUpdating package ${name} to ${version}. Please wait...\n`);
    await install({ name, version });
    const { worona, description, keywords } = require(`../node_modules/${name}/package.json`);
    const config = { ...worona, name, version, description, keywords };
    if (worona.type === 'core') {
      const vendorsName = `vendors-${config.service}-worona`;
      await webpack({ ...config, name: vendorsName, type: 'vendors' });
      await save({ name: vendorsName });
    }
    await webpack(config);
    await save({ name });
  }
  if (packages.length > 0) await purge();
  console.log('\n');
};

process.on('unhandledRejection', (err) => {
  console.log(err.stack);
  process.exit(1);
});

update({ one: argv.one });

export default update;
