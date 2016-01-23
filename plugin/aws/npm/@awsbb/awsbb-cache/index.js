'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./build');
} else {
  module.exports = require('./lib');
}
