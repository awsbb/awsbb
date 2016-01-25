'use strict';

import React from 'react';
import { Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import './style.css';

class Profile extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const { push, isAuthenticated, user } = this.props;
    console.log(user);
    if(isAuthenticated) {
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
    return (
      <section id="profile">
        You can't view this page unless you are logged in.
      </section>
    );
  }
}

Profile.propTypes = {};

function mapStateToProps(state) {
  const { authorize } = state;
  const { isAuthenticated, user } = authorize;
  return {
    isAuthenticated,
    user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    push: bindActionCreators(routeActions.push, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
