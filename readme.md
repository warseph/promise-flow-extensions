# Promise Flow Extensions

This are simple extensions to make handling some common promise flows a bit
more simple.

# Instalation:

```
$ npm install --save promise-flow-extensions
```

# Usage

The library can be used in three ways
### Directly accessing the helper methods:
```js
const promiseFlowExt = require('promise-flow-extensions');

promiseFlowExt.if(Promise.resolve(2), {condition: v => v > 1, true: v => v - 1})
  .then(console.log); // 1
```
**Important!** when using functions this way, the first parameter is always the
promise
### Extending a specific promise:
```js
const promiseFlowExt = require('promise-flow-extensions');

const eventually2 = Promise.resolve(2);
promiseFlowExt.extend(eventually2);
eventually2.if({condition: v => v > 1, true: v => v - 1})
  .then(console.log); // 1
```
### Extending all promises
```js
const promiseFlowExt = require('promise-flow-extensions');
promiseFlowExt.extend(Promise.prototype);

const eventually2 = Promise.resolve(2);
eventually2.if({condition: v => v > 1, true: v => v - 1})
  .then(console.log); // 1
```

### Removing the extensions
You can reset an extended object (i.e. remove all the added methods) by running
```js
const promiseFlowExt = require('promise-flow-extensions');
promiseFlowExt.extend(Promise.prototype);
promiseFlowExt.reset(Promise.prototype);

const promise = Promise.resolve(1);
promise.rethrow(() => null) // promise.rethrow is not a function
  .then(console.log);
```

# Methods

All methods can be called using the 3 options shown above, we'll assume we have
extended all promises for all examples.

## `rethrow(function)`
Catches and exception and executes the passed function. Then it rethrows the
exception received. The function receives the thrown error as an argument.
```js
Promise.reject(new Error('test'))
  .rethrow(e => console.log(e.message)) // test
  .then(v => 'this is never called')
  .catch(e => /* actually handle the error */);
```

## `if(trueFn | {condition, true, false})`
Executes the passed function if the promise is true.
Instead of a function you can provide an object, specify up to 3 values, if any
of those values isn't specified, the default is the identity function, i.e.
`v => v`
  - condition: a function that will be used to evaluate if the promise result
    is true/false
  - true: The function that will be executed when the condition is true
  - false: The function that will be executed when the condition is false
```js
Promise.resolve('test')
  .if({
    condition: v => v === 'test',
    true: v => v + ' ok!',
    false: v => 'this is never called'
  }) // 'test ok!'
  .then(console.log); // 'test ok!'
```

## `retry(function, [condition, [options]])`
Executes the passed function. It will check the result (or the result of calling
condition with the result if a condition is provided). If it's false it will
retry the function `options.retries` times (default: 1), waiting
`options.interval` milliseconds (default 1000) between retries.

`option.interval` is a function, that is called each time with the number of
retries remaining.

If retries run out it will reject the promise with an exception.
```js
Promise.resolve('http://example.org/my-simple-service')
  .retry(u => callService(u), r => r.body === 'ok', {
    retries: 10,
    interval: retries => (10 - retries) * 1000
  })
  .catch(e => {body: 'failed'})
  .then(console.log); // something like {body: ok} ok {body: 'failed'}
```
