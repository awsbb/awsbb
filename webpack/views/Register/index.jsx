'use strict';

import React from 'react';
import { Button, Input } from 'react-bootstrap';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';
import FontAwesome from 'react-fontawesome';

import './style.css';

class Register extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.stateChanged = this.stateChanged.bind(this);
    this.emailValidationState = this.emailValidationState.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.passwordValidationState = this.passwordValidationState.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.confirmationValidationState = this.confirmationValidationState.bind(this);
    this.handleConfirmationChange = this.handleConfirmationChange.bind(this);
  }
  stateChanged() {

  }
  componentWillMount() {
    this.setState({
      email: '',
      password: '',
      confirmation: ''
    });
  }
  componentDidMount() {

  }
  componentWillUnmount() {

  }
  render() {
    const { push } = this.props;
    var envelope = <FontAwesome name="envelope" fixedWidth/>;
    var lock = <FontAwesome name="lock" fixedWidth/>;
    return (
      <section id="register">
        <form className="form-horizontal">
          <Input
            type="email"
            value={this.state.email}
            placeholder="Enter email"
            label="Email Address:"
            help="Validation is based on a simple regex."
            bsStyle={this.emailValidationState()}
            hasFeedback
            ref="email"
            labelClassName="col-xs-2"
            onChange={this.handleEmailChange}
            addonBefore={envelope}
            wrapperClassName="col-xs-10"/>
          <Input
            type="password"
            value={this.state.password}
            placeholder="Password"
            label="Password:"
            help="Validation is based on string length."
            bsStyle={this.passwordValidationState()}
            hasFeedback
            ref="password"
            labelClassName="col-xs-2"
            onChange={this.handlePasswordChange}
            addonBefore={lock}
            wrapperClassName="col-xs-10"/>
          <Input
            type="password"
            value={this.state.confirmation}
            placeholder="Confirmation"
            label="Confirmation:"
            help="Validation is based on matching the first entry."
            bsStyle={this.confirmationValidationState()}
            hasFeedback
            ref="confirmation"
            labelClassName="col-xs-2"
            onChange={this.handleConfirmationChange}
            addonBefore={lock}
            wrapperClassName="col-xs-10"/>
          <div className="form-group">
            <div className="col-xs-offset-2 col-xs-10">
              <Button
                bsStyle="success"
                onClick={() => {

                }}>
                ★　REGISTER　★
              </Button>
            </div>
          </div>
        </form>
      </section>
    );
  }
  emailValidationState() {
    var email = this.state.email;
    var pattern = /^[A-Z0-9._%+-]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/;
    var regex = new RegExp(pattern, 'i');
    return regex.test(email) ? 'success' : 'error';
  }
  handleEmailChange() {
    this.setState({
      email: this.refs.email.getValue()
    });
  }
  passwordValidationState() {
    let length = this.state.password.length;
    if(length > 10) {
      return 'success';
    }
    if(length > 5) {
      return 'warning';
    }
    return 'error';
  }
  handlePasswordChange() {
    this.setState({
      password: this.refs.password.getValue()
    });
  }
  confirmationValidationState() {
    var password = this.state.password;
    var confirmation = this.state.confirmation;
    if(password === confirmation) {
      return 'success';
    }
    return 'error';
  }
  handleConfirmationChange() {
    this.setState({
      confirmation: this.refs.confirmation.getValue()
    });
  }
}

export default connect(
  null,
  {
    push: routeActions.push
  }
)(Register);
