'use strict';

const extension = require('./extension');

module.exports = extension('ifFalse', (promise, condition, fn) => {
  if (!fn) {
    fn = condition;
    condition = v => v;
  }
  return promise.then(result => condition(result) && result || fn(result));
});
