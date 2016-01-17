'use strict';

import React from 'react';

import './style.css';

export default class Button extends React.Component {
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
      <button
        className={this.props.className || 'btn btn-default'}
        onClick={this.props.onClick}>
        {children}
        {this.props.text}
      </button>
    );
  }
}
