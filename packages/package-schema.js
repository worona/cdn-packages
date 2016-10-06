const Schema = require('mongoose').Schema;

const File = new Schema({
  file: {
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
    required: false,
  },
  _id: false,
});

const Files = new Schema({
  files: {
    type: [File],
    required: true,
  },
  main: {
    type: String,
    required: true,
  },
  assets: {
    type: Assets,
    required: true,
  },
  _id: false,
});

const Menu = new Schema({
  category: {
    type: String,
    required: true,
    enum: ['General', 'Appearance', 'Extensions', 'Publish'],
  },
  order: {
    type: Number,
    min: 1,
    max: 1000,
  },
});

const Package = new Schema({
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
    type: String,
    required: true,
    match: [/^[a-zA-Z0-9]+$/, 'Namespace must be in camelcase'],
  },
  type: {
    type: String,
    required: true,
    enum: ['vendor', 'core', 'theme', 'extension'],
  },
  service: {
    type: String,
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
  dependencies: {
    type: [{
      type: String,
    }],
    required: false,
  },
  dev: {
    type: Files,
    required: true,
  },
  prod: {
    type: Files,
    required: true,
  },
}, {
  collection: 'packages',
  timestamps: true,
});

module.exports = Package;
