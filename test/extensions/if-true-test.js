'use strict';
/* eslint-env node, mocha */
/* global expect, sinon */
/* eslint prefer-arrow-callback: 0 */
require('../helper');

const ifTrue = require('../../extensions/if-true');

describe('If true', function () {
  const valid = Promise.resolve('valid');
  const invalid = Promise.resolve(false);
  ifTrue.extend(valid);
  ifTrue.extend(invalid);

  it('should execute the function if it is true', function () {
    const fn = sinon.spy(v => `${v} test`);
    const test = valid.ifTrue(fn);
    return expect(test).to.eventually.eq('valid test')
      .then(() => expect(fn).to.have.been.calledWith('valid'));
  });

  it('should not execute the function if it is false', function () {
    const fn = sinon.spy(v => `${v} test`);
    const test = invalid.ifTrue(fn);
    return expect(test).to.eventually.eq(false)
      .then(() => expect(fn).to.have.not.been.called);
  });

  it('should use the condition if provided and pass the value', function () {
    const fn = sinon.spy(v => `${v} test`);
    const condition = sinon.spy(v => !v);
    const test = invalid.ifTrue(condition, fn);
    return expect(test).to.eventually.eq('false test')
      .then(() => expect(fn).to.have.been.calledWith(false));
  });
});
