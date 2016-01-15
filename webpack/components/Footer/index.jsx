'use strict';

import React from 'react';

import './style.css';

export default class Footer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.stateChanged = this.stateChanged.bind(this);
  }
  stateChanged() {}
  componentWillMount() {
  }
  componentWillUnmount() {
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
