'use strict';

import Constants from '../constants/Constants.js';
import Dispatcher from '../dispatcher/Dispatcher.js';

export default {
  notifyScrollTop: (scrollTop) => {
    Dispatcher.dispatch({
      actionType: Constants.NOTIFY_SCROLLTOP,
      scrollTop: scrollTop
    });
  }
};
