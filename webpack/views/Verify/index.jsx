'use strict';

import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import { DataActions } from '../../actions';

import './style.css';

class Verify extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.stateChanged = this.stateChanged.bind(this);
  }
  stateChanged() {

  }
  componentWillMount() {

  }
  componentDidMount() {
    const { push, dataActions, location } = this.props;
    setTimeout(() => {
      let email = location.query.email;
      let verify = location.query.verify;
      dataActions.postData('http://127.0.0.1:3000/api/AuthVerifyUser', {
        email,
        verify
      })
      .then(() => push('/thanks?type=VerifyUser'))
      .catch(() => {});
    }, 1000);
  }
  componentWillUnmount() {

  }
  render() {
    const { push } = this.props;
    return (
      <section id="verify">
        <p>
          Verifying your token...
        </p>
      </section>
    );
  }
}

Verify.propTypes = {};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    push: bindActionCreators(routeActions.push, dispatch),
    dataActions: bindActionCreators(DataActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
