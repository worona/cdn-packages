var config = require('./config.json');
var current = require('../dist/current.json');
var values = require('../dist/' + current.name + '/worona.json');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var PackageSchema = require('./package-schema');

var PackageModel = mongoose.model('Package', PackageSchema);
var pkg = PackageModel(values);
var error = pkg.validateSync();
if (error) {
  throw new Error(error);
} else {
  console.log('\nValidation succeed.');
  mongoose.connect(config.mongoUrl);
  PackageModel.findOne({ name: values.name }, function (err, doc) {
    if (err) {
      console.log('\nError retriving doc: ', err);
    } else {
      if (doc === null) {
        console.log('\nPackage not found. Creating new entry.');
        doc = PackageModel(values);
      } else {
        console.log('\nPackage found. Updating values.');
        Object.assign(doc, values);
      }
      doc.save(function(err) {
        mongoose.connection.close()
        if (err) console.log(err);
        else console.log('\nPackage saved successfully on the database.');
      });
    }
  });
}
