'use strict';

const constants = require('../constants.js');

const initialState = {
  number: 1
};

function update(state = initialState, action) {
  if (action.type === constants.INCREASE) {
    return {
      number: state.number + action.amount
    };
  } else if (action.type === constants.DECREASE) {
    return {
      number: state.number - action.amount
    };
  }
  return state;
}

export default update;
