import { spawn } from 'child-process-promise';
import { sync as rimrafSync } from 'rimraf';
import { sync as mkdirpSync } from 'mkdirp';

const update = async () => {
  console.log('=> Updating worona-cordova-index to the latest version.\n');
  await spawn('npm', [ 'install', 'worona-cordova-index@latest' ], { stdio: 'inherit' });
  console.log('=> Removing previous index.html.\n');
  rimrafSync('dist/worona-cordova-index/');
  console.log('=> Moving the index.html to dist.\n');
  mkdirpSync('dist/worona-cordova-index');
  await spawn(
    'cp',
    [
      'node_modules/worona-cordova-index/index.html',
      'dist/worona-cordova-index/index.html',
    ],
    { stdio: 'inherit' },
  );
  console.log('Everything finished.\n');
};

process.on('unhandledRejection', err => {
  console.log(err.stack);
  process.exit(1);
});

update();

export default update;
