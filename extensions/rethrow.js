'use strict';

const libExt = require('library-extensions');

module.exports = libExt.create('rethrow', (promise, fn) => promise.catch(error => {
  fn(error);
  throw error;
}));

