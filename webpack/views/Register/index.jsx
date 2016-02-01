import React, { PropTypes } from 'react';
import { Button, Input } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';
import FontAwesome from 'react-fontawesome';

import * as DataActions from '../../actions/data.js';

import { Validators } from '../../common';

import './style.css';

class Register extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    store: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    dataActions: PropTypes.object.isRequired
  };
  state = {
    email: '',
    password: '',
    confirmation: ''
  };
  componentWillMount = () => {
    const { push, isAuthenticated } = this.props;
    if (isAuthenticated) {
      return push('/');
    }
  };
  render = () => {
    const envelope = <FontAwesome name="envelope" fixedWidth/>;
    const lock = <FontAwesome name="lock" fixedWidth/>;
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
                  ★REGISTER★
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    );
  };
  resolveStyleFromState = (type) => {
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
  };
  handleOnChange = (e) => {
    const state = {};
    const key = e.target.name;
    if(this.refs[key]) {
      state[key] = this.refs[key].getValue();
      this.setState(state);
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { dataActions } = this.props;
    const email = this.refs.email.getValue();
    const password = this.refs.password.getValue();
    const confirmation = this.refs.confirmation.getValue();
    dataActions.queryAPI({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/AuthCreateUser',
      data: {
        email,
        password,
        confirmation
      },
      successRoute: '/thanks?type=CreateUser'
    });
  };
  canSubmit = () => {
    try {
      const email = this.refs.email.getValue();
      const password = this.refs.password.getValue();
      const confirmation = this.refs.confirmation.getValue();
      const validState = Validators.isValidEmail(email) && Validators.isValidPassword(password) && Validators.isValidConfirmation(password, confirmation);
      return !validState;
    } catch (e) {
      return true;
    }
  };
}

const mapStateToProps = (state) => {
  const { store } = state;
  const { data, session } = store;
  const { isAuthenticated } = session;
  return {
    isAuthenticated,
    isFetching: data.isFetching || session.isFetching,
    store
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    push: bindActionCreators(routeActions.push, dispatch),
    dataActions: bindActionCreators(DataActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
