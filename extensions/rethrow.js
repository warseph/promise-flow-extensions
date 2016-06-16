'use strict';

const extension = require('./extension');

module.exports = extension('rethrow', (promise, fn) => promise.catch(error => {
  fn(error);
  throw error;
}));

