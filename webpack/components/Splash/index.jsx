'use strict';

import React from 'react';
import Button from '../Button';

import './style.css';

export default class Splash extends React.Component {
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
      <div id="splash">
        <Button
          className="btn btn-primary"
          text="BUTTON"/>
      </div>
    );
  }
}
