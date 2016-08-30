'use strict';

const rethrow = require('../../extensions/rethrow');

describe('Rethrow', () => {
  const error = new Error('error!');
  const rejected = Promise.reject(error);
  rethrow.extend(rejected);

  it('should rethrow a failed error', () => {
    const test = rejected.rethrow(() => null);
    return expect(test).to.eventually.be.rejectedWith(error);
  });

  it('should call the thrown function', () => {
    const change = sinon.spy();
    const test = rejected.rethrow(change);
    return expect(test).to.eventually.be.rejectedWith(error)
      .then(() => expect(change).to.have.been.calledWith(error));
  });
});
