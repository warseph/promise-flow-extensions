'use strict';

const ifFalse = require('../../extensions/if-false');

describe('If false', () => {
  const valid = Promise.resolve('valid');
  const invalid = Promise.resolve(false);
  ifFalse.extend(valid);
  ifFalse.extend(invalid);

  it('should execute the function if it is false', () => {
    const fn = sinon.spy(v => `${v} test`);
    const test = invalid.ifFalse(fn);
    return expect(test).to.eventually.eq('false test')
      .then(() => expect(fn).to.have.been.calledWith(false));
  });

  it('should not execute the function if it is true', () => {
    const fn = sinon.spy();
    const test = valid.ifFalse(fn);
    return expect(test).to.eventually.eq('valid')
      .then(() => expect(fn).to.have.not.been.called);
  });

  it('should use the condition if provided and pass the value', () => {
    const fn = v => `${v} test`;
    const condition = sinon.spy(v => v !== 'valid');
    const test = valid.ifFalse(condition, fn);
    return expect(test).to.eventually.eq('valid test')
      .then(() => expect(condition).to.have.been.calledWith('valid'));
  });
});
