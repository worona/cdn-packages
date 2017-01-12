import KeyCDN from 'keycdn';
import { yellow } from 'colors';
import config from './config.json';

const keycdn = new KeyCDN(config.keycdn.apiKey);

const log = msg => console.log(yellow(msg));

const purge = zoneId => new Promise((resolve, reject) => {
  keycdn.get(`zones/purge/${zoneId}.json`, err => {
    if (err)
      reject('Error purging the cdn: ');
    else
      resolve(true);
  });
});

export default async () => {
  log('\nPurging the cdn...');
  await purge(config.keycdn.zoneId);
  log('Purging succeed!\n');
}
