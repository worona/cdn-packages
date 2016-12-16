import { Schema } from 'mongoose';

const atLeastOneCdn = value => !!value.dashboard || !!value.app;

const File = new Schema({
  file: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
    minlength: 32,
    maxlength: 32,
    match: [/^[a-z0-9]+$/, 'File hash not valid'],
  },
  _id: false,
});

const Assets = new Schema({
  css: {
    type: [String],
  },
  _id: false,
});

const Files = new Schema({
  files: {
    type: [File],
    required: true,
  },
  main: {
    type: File,
    required: true,
  },
  assets: {
    type: Assets,
  },
  _id: false,
});

const Env = new Schema({
  dev: {
    type: Files,
    required: true,
  },
  prod: {
    type: Files,
    required: true,
  },
  _id: false,
});

const Cdn = new Schema({
  dashboard: {
    type: Env,
  },
  app: {
    type: Env,
  },
  _id: false,
});

const Menu = new Schema({
  services: {
    type: [String],
    required: true,
    enum: ['app', 'amp', 'fbia'],
  },
  category: {
    type: String,
    required: true,
    enum: ['General', 'Themes', 'Extensions', 'Publish'],
  },
  order: {
    type: Number,
    min: 1,
    max: 1000,
  },
  _id: false,
});

const Namespace = new Schema({
  dashboard: {
    type: String,
  },
  app: {
    type: String,
  },
  _id: false,
});

const Package = namespaceType => new Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  version: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  keywords: {
    type: [String],
  },
  niceName: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    match: [/^[a-zA-Z0-9]+$/, 'Slug must be in camelcase'],
  },
  namespace: {
    type: namespaceType === 'string' ? String : Namespace,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['vendors', 'core', 'theme', 'extension'],
  },
  services: {
    type: [String],
    required: true,
    enum: ['dashboard', 'app', 'amp', 'fbia'],
  },
  menu: {
    type: Menu,
  },
  authors: {
    type: [{
      type: String,
      match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email in authors not valid'],
    }],
    required: true,
  },
  default: {
    type: Boolean,
    required: true,
    default: 0,
  },
  core: {
    type: Boolean,
    required: true,
    default: 0,
  },
  listed: {
    type: Boolean,
    required: true,
    default: 1,
  },
  deactivable: {
    type: Boolean,
    required: true,
    default: 1,
  },
  public: {
    type: Boolean,
    required: true,
    default: 1,
  },
  cdn: {
    type: Cdn,
    required: true,
    validate: [atLeastOneCdn, 'You need to add files from at least one service (dashboard or app).'],
  },
}, {
  collection: 'packages',
  timestamps: true,
});

export default Package;
