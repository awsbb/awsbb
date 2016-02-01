import { combineReducers } from 'redux';

import data from './data.js';
import session from './session.js';

const rootReducer = combineReducers({
  data,
  session
});

export default rootReducer;
