'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import { Rover } from '../../common';

import './style.css';

class Verify extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    const { push, location } = this.props;
    let email = location.query.email;
    let verify = location.query.verify;
    Rover.rover('http://127.0.0.1:3000/api/AuthVerifyUser', {
      method: 'POST',
      body: JSON.stringify({
        email,
        verify
      })
    })
    .then(() => push('/thanks?type=VerifyUser'))
    .catch(() => {});
  }
  render() {
    return (
      <section id="verify">
        <div className="container">
          <p>
            Verifying your token...
          </p>
        </div>
      </section>
    );
  }
}

Verify.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    push: bindActionCreators(routeActions.push, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
