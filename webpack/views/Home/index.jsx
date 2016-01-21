'use strict';

import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import './style.css';

class Home extends React.Component {
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
      <section id="home">
        <h1>HOME</h1>
        <Button
          bsClass="btn"
          bsStyle="primary"
          onClick={() => push('/')}>
          ★　GO HOME　★
        </Button>
      </section>
    );
  }
}

export default connect(
  null,
  {
    push: routeActions.push
  }
)(Home);
