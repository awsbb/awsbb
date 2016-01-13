'use strict';

import React from 'react';
import Button from './Button.jsx';
import SiteStore from '../stores/SiteStore';

export default class Splash extends React.Component {
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
      <div id="splash">
        <Button
          className="btn btn-primary"
          text="BUTTON"/>
      </div>
    );
  }
}
