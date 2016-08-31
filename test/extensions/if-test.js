'use strict';

const ifExt = require('../../extensions/if');

describe('If', () => {
  const valid = Promise.resolve('valid');
  const invalid = Promise.resolve(false);
  ifExt.extend(valid);
  ifExt.extend(invalid);

  it('should execute the function if it is true', () => {
    const fn = sinon.spy(v => `${v} test`);
    const test = valid.if(fn);
    return expect(test).to.eventually.eq('valid test')
      .then(() => expect(fn).to.have.been.calledWith('valid'));
  });

  it('should not execute the function if it is false', () => {
    const fn = sinon.spy(v => `${v} test`);
    const test = invalid.if(fn);
    return expect(test).to.eventually.eq(false)
      .then(() => expect(fn).to.have.not.been.called);
  });

  it('should use the condition if provided and pass the value', () => {
    const fn = sinon.spy(v => `${v} test`);
    const condition = sinon.spy(v => !v);
    const test = invalid.if({condition, true: fn});
    return expect(test).to.eventually.eq('false test')
      .then(() => expect(fn).to.have.been.calledWith(false));
  });

  it('should not call anything when true if only false is provided', () => {
    const fn = sinon.spy(v => `${v} test`);
    const test = valid.if({false: fn});
    return expect(test).to.eventually.eq('valid')
      .then(() => expect(fn).to.have.not.been.called);
  });

  it('should not call false when the condition is false', () => {
    const fnT = sinon.spy(v => `${v} true`);
    const fnF = sinon.spy(v => `${v} false`);
    const condition = sinon.spy(v => v);
    const test = invalid.if({condition, true: fnT, false: fnF});
    return expect(test).to.eventually.eq('false false')
      .then(() => expect(fnT).to.have.not.been.called)
      .then(() => expect(fnF).to.have.been.calledWith(false));
  });
});
