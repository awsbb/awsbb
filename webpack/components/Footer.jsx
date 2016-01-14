'use strict';

import React from 'react';
import SiteStore from '../stores/SiteStore.js';

export default class Footer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.stateChanged = this.stateChanged.bind(this);
  }
  stateChanged() {}
  componentWillMount() {
    SiteStore.addChangeListener(this.stateChanged);
  }
  componentWillUnmount() {
    SiteStore.removeChangeListener(this.stateChanged);
  }
  render() {
    return (
      <section id="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              FOOTER
            </div>
          </div>
        </div>
      </section>
    );
  }
}
