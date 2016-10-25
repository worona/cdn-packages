/* eslint-disable */
require('babel-core/register');
require('babel-polyfill');
var update = require('./update.js').default;

update({ all: true });
