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

class LostPassword extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.resolveStyleFromState = this.resolveStyleFromState.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillMount() {
    this.setState({
      email: '',
      password: ''
    });
  }
  render() {
    let envelope = <FontAwesome name="envelope" fixedWidth/>;
    return (
      <section id="login">
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
            <div className="form-group">
              <div className="col-xs-offset-2 col-xs-10">
                <Button
                  bsStyle="success"
                  onClick={this.handleSubmit}
                  disabled={this.canSubmit()}>
                  ★　SEND E-MAIL　★
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
    dataActions.postData('http://127.0.0.1:3000/api/AuthLostPassword', {
      email
    })
    .then(() => push('/thanks?type=LostPassword'))
    .catch(() => {});
  }
  canSubmit() {
    try {
      let email = this.refs.email.getValue();
      let validState = Validators.isValidEmail(email);
      return !validState;
    } catch (e) {
      return true;
    }
  }
}

LostPassword.propTypes = {};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    push: bindActionCreators(routeActions.push, dispatch),
    dataActions: bindActionCreators(DataActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LostPassword);
