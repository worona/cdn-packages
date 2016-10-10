var path = require('path');
var fs = require('fs');
var services = ['dashboard', 'app'];

var checkForService = function(service) {
  try {
    fs.accessSync(path.resolve('src', service, 'index.js'), fs.F_OK);
    return true;
  } catch (e) {
    return false;
  }
};

// var getEntries = function() {
//   var entries = {};
//   services.forEach(function(service) {
//     if (checkForService(service)) entries[service] = path.resolve('src', service, 'index.js');
//   });
//   return entries;
// };

var getEntries = function() {
  var finalServices = [];
  services.forEach(function(service) {
    if (checkForService(service)) finalServices.push(service);
  });
  return finalServices;
};

module.exports = getEntries;
