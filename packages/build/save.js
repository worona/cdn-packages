import mongoose from 'mongoose';
import { cyan } from 'colors';
import config from './config.json';
import packageSchema from './package-schema';

mongoose.Promise = global.Promise;

const log = msg => console.log(cyan(msg));

export default async (values) => {
  console.log(JSON.stringify(values, null, 2));
  const packageModel = mongoose.model('Package', packageSchema(typeof values.namespace));
  const pkg = packageModel(values);
  const error = await pkg.validate();
  if (error) throw new Error(error);
  log('\nValidation succeed.');
  mongoose.connect(config.mongoUrl);
  await packageModel.findOneAndUpdate(
    { name: values.name },
    values,
    { upsert: true, overwrite: true }
  ).exec();
  log('Package saved successfully on the database.\n');
  mongoose.connection.close();
};
