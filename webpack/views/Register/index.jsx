'use strict';

import React from 'react';
import Button from '../../components/Button';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import './style.css';

class Register extends React.Component {
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
    const { push } = this.props;
    return (
      <section id="register">
        <h1>REGISTER</h1>
        <Button
          className="btn btn-primary"
          text="★　GO HOME　★"
          onClick={() => push('/')}/>
      </section>
    );
  }
}

export default connect(
  null,
  {
    push: routeActions.push
  }
)(Register);
