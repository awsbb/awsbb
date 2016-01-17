'use strict';

import React from 'react';

import './style.css';

export default class Footer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.stateChanged = this.stateChanged.bind(this);
  }
  stateChanged() {

  }
  componentWillMount() {

  }
  componentDidMount() {

  }
  componentWillUnmount() {

  }
  render() {
    return (
      <section id="footer">
        <div className="container">
          <hr/>
          <div className="row">
            <div className="col-sm-3">
              FOOTER #1
            </div>
            <div className="col-sm-3">
              FOOTER #2
            </div>
            <div className="col-sm-3">
              FOOTER #3
            </div>
          </div>
        </div>
      </section>
    );
  }
}
