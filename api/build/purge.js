import KeyCDN from 'keycdn';
import config from '../config.json';

const keycdn = new KeyCDN(config.keycdn.apiKey);

const purgeZone = zoneId => new Promise((resolve, reject) => {
  keycdn.get(`zones/purge/${zoneId}.json`, (err) => {
    if (err) reject('Error purging the cdn: ');
    else resolve(true);
  });
});

const purge = async () => {
  console.log('\nPurging the cdn...');
  await purgeZone(config.keycdn.zoneId);
  console.log('Purging succeed!\n');
};

export default purge;

purge();
