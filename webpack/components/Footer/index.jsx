'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import './style.css';

class Footer extends React.Component {
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
              <div>
                FOOTER #1
              </div>
              <div>
                Content
              </div>
            </div>
            <div className="col-sm-3">
              <div>
                FOOTER #2
              </div>
              <div>
                Content
              </div>
            </div>
            <div className="col-sm-3">
              <div>
                FOOTER #3
              </div>
              <div>
                Content
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default connect(null, {
  push: routeActions.push
})(Footer);
