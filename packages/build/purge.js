import KeyCDN from 'keycdn';
import { yellow } from 'colors';
import settings from './settings.json';
const keycdn = new KeyCDN(settings.keycdn.apiKey);

const log = msg => console.log(yellow(msg));

const purge = zoneId => new Promise((resolve, reject) => {
  keycdn.get('zones/purge/' + zoneId + '.json', function(err, res) {
    if (err) reject('Error purging the cdn: ');
    else resolve(true);
  });
});

export default async () => {
  log('\nPurging the cdn...');
  await purge(settings.keycdn.zoneId);
  log('Purging succeed!\n');
};
