'use strict';

const extension = require('./extension');

module.exports = extension('ifTrue', (promise, condition, fn) => {
  if (!fn) {
    fn = condition;
    condition = v => v;
  }
  return promise.then(result => condition(result) && fn(result) || result);
});
