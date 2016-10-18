import inquire from './inquire';
import install from './install';
import webpack from './webpack';
import save from './save';
import purge from './purge';

const start = async () => {
  const { name, version } = await inquire();
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
  await purge();
};

process.on('unhandledRejection', (err) => {
  console.log(err.stack);
  process.exit(1);
});

start();
