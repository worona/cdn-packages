import inquire from './inquire';
import install from './install';
import webpack from './webpack';

const start = async () => {
  const { name, version } = await inquire();
  await install({ name, version });
  const { worona, description, keywords } = require(`../node_modules/${name}/package.json`);
  const config = { ...worona, name, version, description, keywords };
  if (worona.type === 'core') {
    await webpack({ ...config, name: `vendors-${config.service}-worona`, type: 'vendors' });
  }
};

process.on('unhandledRejection', (err) => {
  console.log(err.stack);
  process.exit(1);
});

start();
