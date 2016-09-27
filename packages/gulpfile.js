const gulp = require('gulp');
const prompt = require('gulp-prompt');
const KeyCDN = require('keycdn');
const semver = require('semver');
const exec = require('child_process').exec;
const mongoose = require('mongoose');
const PackageSchema = require('./package-schema');
const PackageModel = mongoose.model('Package', PackageSchema);
const config = require('./config.json');
mongoose.Promise = global.Promise;
const keycdn = new KeyCDN(config.keycdn.apiKey);

const getValues = name => {
  try {
    const packageJson = require('./node_modules/' + name + '/package.json');
    return Object.assign({}, packageJson.worona, {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
    });
  } catch (error) {
    throw new Error('Package ' + name + ' not found in node_modules.');
  }
}

const getPackage = name => {
  const values = getValues(name);
  return new PackageModel(values);
}

const savePackage = (name, cb) => {
  const pkg = getPackage(name);
  const error = pkg.validateSync();
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
        doc.save(err => {
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


gulp.task('validate', cb => {
  console.log('\n');
  gulp.src('package.json').pipe(prompt.prompt({
		type: 'input',
		name: 'package',
		message: 'Which package do you want to validate?'
	}, function(res){
    const pkg = getPackage(res.package);
    const error = pkg.validateSync();
    if (!error) console.log('\nValidation succeed.\n');
    else console.log('\n', error, '\n');
    cb();
  }));
});

gulp.task('save', cb => {
  console.log('\n');
  gulp.src('package.json').pipe(prompt.prompt({
		type: 'input',
		name: 'package',
		message: 'Which package do you want to save?'
	}, function(res){
    savePackage(res.package, cb);
  }));
});

gulp.task('install', cb => {
  console.log('\n');
  gulp.src('package.json')
	.pipe(prompt.prompt({
		type: 'input',
		name: 'package',
		message: 'Which package do you want to install?'
	}, function(res1){
    const packageJson = require('./package.json');
    const version = packageJson.dependencies[res1.package];
    const defaultVersion = version ? semver.inc(version, 'patch') : '1.0.0';
    gulp.src('package.json')
    .pipe(prompt.prompt({
      type: 'input',
      name: 'version',
      message: 'Which version do you want to install?',
      default: defaultVersion,
    }, function(res2) {
      const packageName = res1.package + '@' + res2.version;
      console.log('\nInstalling ' + packageName + '. Please wait...');
      exec('npm install --save --save-exact ' + packageName, function(error, stdout, stderr) {
        console.log('\n');
        if (stdout) console.log('NPM: ', stdout);
        if (stderr) console.log('NPM STDERR: ', stderr);
        if (error !== null) {
          console.log('NPM error, stoping here.');
          console.log(error);
          console.log('\n');
          cb();
        } else {
          console.log('Installation succeed.');
          savePackage(res1.package, cb);
        }
      });
    }));
	}));

});
