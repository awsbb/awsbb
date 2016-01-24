'use strict';

import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import './style.css';

class Profile extends React.Component {
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
      <section id="profile">
        <h1>PROFILE</h1>
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

Profile.propTypes = {};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    push: bindActionCreators(routeActions.push, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
