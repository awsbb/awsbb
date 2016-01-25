'use strict';

import React from 'react';
import { Button, Input } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';
import FontAwesome from 'react-fontawesome';

import { DataActions } from '../../actions';

import { Validators } from '../../common';

import './style.css';

class Register extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.resolveStyleFromState = this.resolveStyleFromState.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillMount() {
    this.setState({
      email: '',
      password: '',
      confirmation: ''
    });
  }
  render() {
    const { isAuthenticated } = this.props;
    if(isAuthenticated) {
      return (
        <section id="register">
          You are already logged in.
        </section>
      );
    }
    let envelope = <FontAwesome name="envelope" fixedWidth/>;
    let lock = <FontAwesome name="lock" fixedWidth/>;
    return (
      <section id="register">
        <div className="container">
          <form className="form-horizontal">
            <Input
              type="email"
              value={this.state.email}
              placeholder="Enter email"
              label="Email Address:"
              help="Validation is based on a simple regex."
              bsStyle={this.resolveStyleFromState('email')}
              hasFeedback
              name="email"
              ref="email"
              labelClassName="col-xs-2"
              onChange={this.handleOnChange}
              addonBefore={envelope}
              wrapperClassName="col-xs-10"/>
            <Input
              type="password"
              value={this.state.password}
              placeholder="Password"
              label="Password:"
              help="Validation is based on string length."
              bsStyle={this.resolveStyleFromState('password')}
              hasFeedback
              name="password"
              ref="password"
              labelClassName="col-xs-2"
              onChange={this.handleOnChange}
              addonBefore={lock}
              wrapperClassName="col-xs-10"/>
            <Input
              type="password"
              value={this.state.confirmation}
              placeholder="Confirmation"
              label="Confirmation:"
              help="Validation is based on matching the first entry."
              bsStyle={this.resolveStyleFromState('confirmation')}
              hasFeedback
              name="confirmation"
              ref="confirmation"
              labelClassName="col-xs-2"
              onChange={this.handleOnChange}
              addonBefore={lock}
              wrapperClassName="col-xs-10"/>
            <div className="form-group">
              <div className="col-xs-offset-2 col-xs-10">
                <Button
                  bsStyle="success"
                  onClick={this.handleSubmit}
                  disabled={this.canSubmit()}>
                  ★　REGISTER　★
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    );
  }
  resolveStyleFromState(type) {
    switch (type) {
      case 'email':
        return Validators.getEmailValidationClass(this.state.email);
      case 'password':
        return Validators.getPasswordValidationClass(this.state.password);
      case 'confirmation':
        return Validators.getConfirmationValidationClass(this.state.password, this.state.confirmation);
      default:
        return '';
    }
  }
  handleOnChange(e) {
    let state = {};
    let key = e.target.name;
    if(this.refs[key]) {
      state[key] = this.refs[key].getValue();
      this.setState(state);
    }
  }
  handleSubmit() {
    const { push, dataActions } = this.props;
    let email = this.refs.email.getValue();
    let password = this.refs.password.getValue();
    let confirmation = this.refs.confirmation.getValue();
    console.log('email:', email);
    console.log('password:', password);
    console.log('confirmation:', confirmation);
    dataActions.postData('http://127.0.0.1:3000/api/AuthCreateUser', {
      email,
      password,
      confirmation
    })
    .then(() => push('/thanks?type=CreateUser'))
    .catch(() => {});
  }
  canSubmit() {
    try {
      let email = this.refs.email.getValue();
      let password = this.refs.password.getValue();
      let confirmation = this.refs.confirmation.getValue();
      let validState = Validators.isValidEmail(email) && Validators.isValidPassword(password) && Validators.isValidConfirmation(password, confirmation);
      return !validState;
    } catch (e) {
      return true;
    }
  }
}

Register.propTypes = {};

function mapStateToProps(state) {
  const { authorize } = state;
  const { isAuthenticated } = authorize;
  return {
    isAuthenticated
  };
}

function mapDispatchToProps(dispatch) {
  return {
    push: bindActionCreators(routeActions.push, dispatch),
    dataActions: bindActionCreators(DataActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
