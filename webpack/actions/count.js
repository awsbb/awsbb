'use strict';

const constants = require('../constants.js');

function increase(n) {
  return {type: constants.INCREASE, amount: n};
}

function decrease(n) {
  return {type: constants.DECREASE, amount: n};
}

export default {
  increase,
  decrease
};
