'use strict';

const libExt = require('library-extensions');

module.exports = libExt.create('ifFalse', (promise, condition, fn) => {
  if (!fn) {
    fn = condition;
    condition = v => v;
  }
  return promise.then(result => condition(result) && result || fn(result));
});
