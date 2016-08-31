'use strict';

const libExt = require('library-extensions');
const ifExt = require('./if');

const delay = (time, val) => new Promise(res => setTimeout(() => res(val), time));

module.exports = libExt.create('retry', (promise, fn, condition, options) => {
  options = Object.assign({
    retries: 1,
    interval: () => 1000
  }, options || {});
  condition = condition || (v => v);
  const retry = (p, retries) => ifExt.extend(p.then(fn)).if({
    condition,
    false: () => {
      if (retries <= 0) { throw new Error('Attempts expired'); }
      return retry(delay(options.interval(retries), promise), retries - 1);
    }
  });
  return retry(promise, options.retries);
});
