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
  await packageModel.findOneAndUpdate(
    { name },
    values,
    { upsert: true, overwrite: true }
  ).exec();
  mongoose.connection.close();
  log('Package saved successfully on the database.\n');
};
