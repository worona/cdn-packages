const gulp = require('gulp');
const prompt = require('gulp-prompt');
const semver = require('semver');
const exec = require('child_process').exec;
const mongoose = require('mongoose');
const ExtensionSchema = require('./extension-schema');
const ExtensionModel = mongoose.model('Extension', ExtensionSchema);
const config = require('./config.json');
mongoose.Promise = global.Promise;

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

const getExtension = name => {
  const values = getValues(name);
  return new ExtensionModel(values);
}

const saveExtension = (name, cb) => {
  const extension = getExtension(name);
  const error = extension.validateSync();
  if (error) {
    console.log('\n', error, '\n');
    cb();
  } else {
    console.log('\nValidation succeed.');
    mongoose.connect(config.mongoUrl);
    ExtensionModel.findOne({ name: name }, function (err, doc) {
      if (err) {
        console.log('\nError retriving doc: ', err);
        cb();
      } else {
        if (doc === null) {
          console.log('\nPackage not found. Creating new entry.');
          doc = getExtension(name);
        } else {
          console.log('\nPackage found. Updating values.');
          Object.assign(doc, getValues(name));
        }
        doc.save(err => {
          mongoose.connection.close()
          if (err) console.log(err);
          else console.log('\nPackage saved successfully on the database.\nEverything in order!\n\n');
          cb();
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
    const extension = getExtension(res.package);
    const error = extension.validateSync();
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
    saveExtension(res.package, cb);
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
          saveExtension(res1.package, cb);
        }
      });
    }));
	}));

});
