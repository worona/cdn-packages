import mongoose from 'mongoose';
import { cyan } from 'colors';
import config from './config.json';
import PackageSchema from './package-schema';

mongoose.Promise = global.Promise;
const packageModel = mongoose.model('Package', PackageSchema);

const log = msg => console.log(cyan(msg));

export default async ({ name }) => {
  const values = require(`../dist/${name}/worona.json`);
  const pkg = packageModel(values);
  const error = await pkg.validate();
  if (error) throw new Error(error);
  log('\nValidation succeed.');
  mongoose.connect(config.mongoUrl);
  let doc = await packageModel.findOne({ name }).exec();
  if (doc === null) {
    log('Package not found. Creating new entry.');
    doc = packageModel(values);
    await doc.save();
  } else {
    log('Package found. Overwriting values.');
    await packageModel
      .where({ _id: doc._id })
      .setOptions({ overwrite: true })
      .update(values)
      .exec();
  }
  mongoose.connection.close();
  log('Package saved successfully on the database.\n');
};
