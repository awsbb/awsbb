'use strict';

import Dispatcher from '../dispatcher/Dispatcher';
import EventEmitter from 'events';
import Constants from '../constants/Constants';

class SiteStore extends EventEmitter {
  constructor() {
    super();
    this.notification = null;
    this.scrollTop = null;
    this.addChangeListener = this.addChangeListener.bind(this);
    this.removeChangeListener = this.removeChangeListener.bind(this);

    Dispatcher.register((payload) => {
      switch (payload.actionType) {
        case Constants.NOTIFY_SCROLLTOP:
          this.scrollTop = payload.scrollTop;
          this.emit('change');
          break;
        default:
          break;
      }
      return true;
    });
  }
  addChangeListener(callback) {
    this.on('change', callback);
  }
  removeChangeListener(callback) {
    this.removeListener('change', callback);
  }
  getScrollTop() {
    return this.scrollTop;
  }

}

export default new SiteStore();
