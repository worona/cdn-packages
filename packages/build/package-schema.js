import { Schema } from 'mongoose';

const File = new Schema({
  file: { type: String, required: true },
  filename: { type: String, required: true },
  hash: {
    type: String,
    required: true,
    minlength: 32,
    maxlength: 32,
    match: [ /^[a-z0-9]+$/, 'File hash not valid' ],
  },
  _id: false,
});

const Assets = new Schema({ css: { type: [ String ] }, _id: false });

const Files = new Schema({
  files: { type: [ File ], required: true },
  main: { type: File, required: true },
  assets: { type: Assets },
  _id: false,
});

const Menu = new Schema({
  niceName: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [ 'Settings', 'Themes', 'Extensions', 'Publish' ],
  },
  order: { type: Number, min: 1, max: 1000 },
  _id: false,
});

const Menus = new Schema({
  app: { type: Menu },
  fbia: { type: Menu },
  amp: { type: Menu },
  _id: false,
});

const Dashboard = new Schema({
  namespace: { type: String, required: true },
  type: { type: String, required: true, enum: [ 'vendors', 'core', 'theme', 'extension' ] },
  core: { type: Boolean },
  menu: { type: Menus },
  dev: { type: Files, required: true },
  prod: { type: Files, required: true },
  _id: false,
});

const App = new Schema({
  namespace: { type: String, required: true },
  type: { type: String, required: true, enum: [ 'vendors', 'core', 'theme', 'extension' ] },
  core: { type: Boolean },
  listed: { type: Boolean, default: true },
  niceName: { type: String },
  description: { type: String },
  image: { type: String },
  dev: { type: Files, required: true },
  prod: { type: Files, required: true },
  _id: false,
});

const Package = new Schema(
  {
    name: { type: String, required: true, index: true },
    version: { type: String, required: true },
    description: { type: String, required: true },
    keywords: { type: [ String ] },
    authors: {
      type: [
        {
          type: String,
          match: [ /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email in authors not valid' ],
        },
      ],
      required: true,
    },
    private: { type: Boolean, default: false },
    dashboard: { type: Dashboard },
    app: { type: App },
  },
  { collection: 'packages', timestamps: true },
);

export default Package;
