'use strict';

import React from 'react';
import { Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import './style.css';

class About extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const { push } = this.props;
    return (
      <section id="about">
        <h1>ABOUT</h1>
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

About.propTypes = {};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    push: bindActionCreators(routeActions.push, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(About);
