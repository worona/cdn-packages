var rimraf = require('rimraf');

rimraf('./dist/current.json', function(err) {
  if (err) throw new Error(err);
  console.log('\nFinished!\n\n');
});
