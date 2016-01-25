'use strict';

import React from 'react';
import { Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';
import classNames from 'classnames';

import style from './style.css';

class Profile extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const { push, isAuthenticated, user } = this.props;
    console.log(this.props);
    let className = classNames({
      jumbotron: true,
      'text-center': true,
      [style['profile-jumbotron']]: true
    });
    if(isAuthenticated) {
      return (
        <section id="profile">
          <div className={className}>
            <h3>{user.email}</h3>
          </div>
          <div className="container">
            <h1>PROFILE</h1>
            <Button
              bsClass="btn"
              bsStyle="primary"
              onClick={() => push('/')}>
              ★　GO HOME　★
            </Button>
          </div>
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
