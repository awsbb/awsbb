const cacheKeys = Object.keys(require.cache);

const registered = cacheKeys.filter((key) => key.includes('/babel-register/')).length ? true : false;
const polyfilled = cacheKeys.filter((key) => key.includes('/babel-polyfill/')).length ? true : false;

if(!registered) {
  require('babel-register');
}
if(!polyfilled) {
  require('babel-polyfill');
}

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib');
} else {
  module.exports = require('./src');
}
