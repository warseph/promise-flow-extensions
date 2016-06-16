'use strict';
/* eslint-env node, mocha */
/* global expect, sinon */
/* eslint prefer-arrow-callback: 0 */
require('../helper');

const rethrow = require('../../extensions/rethrow');

describe('Rethrow', function () {
  const error = new Error('error!');
  const rejected = Promise.reject(error);
  rethrow.extend(rejected);

  it('should rethrow a failed error', function () {
    const test = rejected.rethrow(() => null);
    return expect(test).to.eventually.be.rejectedWith(error);
  });

  it('should call the thrown function', function () {
    const change = sinon.spy();
    const test = rejected.rethrow(change);
    return expect(test).to.eventually.be.rejectedWith(error)
      .then(() => expect(change).to.have.been.calledWith(error));
  });
});
