'use strict';
/* eslint-env node, mocha */
/* global expect */
/* eslint prefer-arrow-callback: 0 */
require('../helper');

const extension = require('../../extensions/extension');

describe('Extension', function () {
  it('should return an extension object', function () {
    const ext = extension('testExt', () => null);
    expect(ext.name).to.eq('testExt');
    expect(ext.static).to.be.a('function');
    expect(ext.extend).to.be.a('function');
  });

  it('should allow calling the static method directly', function () {
    const ext = extension('testExt', (promise) => promise.then(v => v + 1));
    return expect(ext.static(Promise.resolve(1))).to.eventually.eq(2);
  });

  it('should allow extending an object with the extension method', function () {
    const ext = extension('testExt', (promise) => promise.then(v => v + 1));
    const promise = Promise.resolve(1);
    ext.extend(promise);
    return expect(promise.testExt()).to.eventually.eq(2);
  });
});
