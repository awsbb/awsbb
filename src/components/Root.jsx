'use strict';

import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import SiteStore from '../stores/SiteStore';
import Actions from '../actions/Actions.js';

export default class Root extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.stateChanged = this.stateChanged.bind(this);
  }
  stateChanged() {}
  onScroll(event) {
    Actions.notifyScrollTop(event.srcElement.body.scrollTop);
  }
  componentWillMount() {
    window.addEventListener('scroll', this.onScroll);
    SiteStore.addChangeListener(this.stateChanged);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
    SiteStore.removeChangeListener(this.stateChanged);
  }
  render() {
    return (
      <div>
        <Header/>
        <div className="container" id="content">
          {this.props.children}
        </div>
        <Footer/>
      </div>
    );
  }
}
