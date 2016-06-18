'use strict';

const libExt = require('library-extensions');
const ifFalse = require('./if-false');

const delay = (time, val) => new Promise(res => setTimeout(() => res(val), time));

module.exports = libExt.create('retry', (promise, fn, cond, options) => {
  options = Object.assign({
    retries: 1,
    interval: () => 1000
  }, options || {});
  cond = cond || (v => v);
  const retry = (p, retries) => ifFalse.extend(p.then(fn))
    .ifFalse(cond, () => {
      if (retries <= 0) { throw new Error('Attempts expired'); }
      return retry(delay(options.interval(retries), promise), retries - 1);
    });
  return retry(promise, options.retries);
});
