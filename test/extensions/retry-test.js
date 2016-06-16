'use strict';
/* eslint-env node, mocha */
/* global expect, sinon */
/* eslint prefer-arrow-callback: 0 */
require('../helper');

const retry = require('../../extensions/retry');

describe('Retry', function () {
  const promise = Promise.resolve(0);
  retry.extend(promise);

  it('should execute only once if the condition passes', function () {
    const fn = sinon.spy(v => v + 1);
    const condition = sinon.spy(v => v === 1);
    const test = promise.retry(fn, condition);
    return expect(test).to.eventually.eq(1)
      .then(() => expect(fn).to.have.been.calledOnce)
      .then(() => expect(condition).to.have.been.calledOnce);
  });

  it('should retry if the condition fails', function () {
    let i = 1;
    const fn = sinon.spy(v => v + i++);
    const condition = sinon.spy(v => v === 2);
    const options = {retries: 1, interval: () => 0};
    const test = promise.retry(fn, condition, options);
    return expect(test).to.eventually.eq(2)
      .then(() => expect(fn).to.have.been.calledTwice)
      .then(() => expect(condition).to.have.been.calledTwice);
  });

  it('should fail if the attempts run out', function () {
    let i = 1;
    const fn = sinon.spy(v => v + i++);
    const condition = sinon.spy(v => v === 3);
    const options = {retries: 1, interval: () => 0};
    const test = promise.retry(fn, condition, options);
    return expect(test).to.be.rejectedWith('Attempts expired')
      .then(() => expect(fn).to.have.been.calledTwice)
      .then(() => expect(condition).to.have.been.calledTwice);
  });
});
