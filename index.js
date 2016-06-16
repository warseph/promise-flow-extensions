'use strict';

const extensions = [
  /* eslint global-require: 0 */
  require('./extensions/if-true'),
  require('./extensions/if-false'),
  require('./extensions/rethrow')
];

class PromiseFlowExtensions {
  constructor() {
    extensions.forEach(ext => { this[ext.name] = ext.static; });
  }

  extend(promiseObject) {
    extensions.forEach(ext => ext.extend(promiseObject));
  }
}

module.exports = new PromiseFlowExtensions();
