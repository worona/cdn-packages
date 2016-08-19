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

const Files = new Schema({
  files: {
    type: [File],
    required: true,
  },
  main: {
    type: String,
    required: true,
  },
  _id: false,
});

const Extension = new Schema({
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
  dev: {
    type: Files,
    required: true,
  },
  prod: {
    type: Files,
    required: true,
  },
}, {
  collection: 'extensions',
  timestamps: true,
});

module.exports = Extension;
