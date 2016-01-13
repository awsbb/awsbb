'use strict';

import React from 'react';
import SiteStore from '../stores/SiteStore';

export default class Button extends React.Component {
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
      <button
        className={this.props.className || 'btn btn-default'}
        onClick={this.props.onClick}>
        {this.props.text}
      </button>
    );
  }
}
