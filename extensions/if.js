'use strict';

const isFunction = require('util').isFunction;
const libExt = require('library-extensions');

const identity = v => v;
const defaults = {condition: identity, true: identity, false: identity};

module.exports = libExt.create('if', (promise, options) => {
  if (isFunction(options)) {
    options = { true: options };
  }
  const methods = Object.assign({}, defaults, options);

  return promise.then(result =>
    methods.condition(result) ? methods.true(result) : methods.false(result));
});
