var KeyCDN = require('keycdn');
var config = require('./config.json');
var keycdn = new KeyCDN(config.keycdn.apiKey);

console.log('\nPurging the cdn...');

keycdn.get('zones/purge/' + config.keycdn.zoneId + '.json', function(err, res) {
  if (err) {
      console.log('\nError purging the cdn: ', err);
  } else {
      console.log('\nPurging succeed!\n\n');
  }
});
