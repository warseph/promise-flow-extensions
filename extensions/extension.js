'use strict';

module.exports = (name, fn) => ({
  name,
  static: fn,
  extend(obj) {
    obj[name] = function () {
      return fn.apply(null, [this].concat([].slice.call(arguments)));
    };
    return obj;
  }
});
