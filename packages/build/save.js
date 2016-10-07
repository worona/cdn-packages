var current = require('../dist/current.json');
var mongoose = require('mongoose');
var PackageSchema = require('./package-schema');
var PackageModel = mongoose.model('Package', PackageSchema);

var getPackage = function(name) {
  var values = require('../dist/' + current.name + '/worona.json');
  return new PackageModel(values);
}

var savePackage = function(name, cb) {
  var pkg = getPackage(name);
  var error = pkg.validateSync();
  if (error) {
    console.log('\n', error, '\n');
    cb();
  } else {
    console.log('\nValidation succeed.');
    mongoose.connect(config.mongoUrl);
    PackageModel.findOne({ name: name }, function (err, doc) {
      if (err) {
        console.log('\nError retriving doc: ', err);
        cb();
      } else {
        if (doc === null) {
          console.log('\nPackage not found. Creating new entry.');
          doc = getPackage(name);
        } else {
          console.log('\nPackage found. Updating values.');
          Object.assign(doc, getValues(name));
        }
        doc.save(function(err) {
          mongoose.connection.close()
          if (err) console.log(err);
          else console.log('\nPackage saved successfully on the database.');
          console.log('\nPurging the cdn...');
          keycdn.get('zones/purge/' + config.keycdn.zoneId + '.json', function(err, res) {
            if (err) {
                console.log('\nError purging the cdn: ', err);
            } else {
                console.log('\nPurging succeed!\nEverything in order!\n\n');
            }
            cb();
          });
        });
      }
    });
  }
};
