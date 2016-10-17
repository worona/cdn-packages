require('babel-core/register');
require('babel-polyfill');
var save = require('./save.js').default;

process.on('unhandledRejection', err => {
  console.log(err.stack);
  process.exit(1);
});


save({ name: 'bulma-dashboard-theme-worona' });
