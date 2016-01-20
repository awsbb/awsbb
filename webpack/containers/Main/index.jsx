'use strict';

import React from 'react';

import './style.css';

class Main extends React.Component {
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
    const { children } = this.props;
    return (
      <section id="main">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              {children}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Main;
