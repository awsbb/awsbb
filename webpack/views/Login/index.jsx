import React, { PropTypes } from 'react';
import { Button, Input } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { routeActions } from 'redux-simple-router';
import FontAwesome from 'react-fontawesome';

import * as SessionActions from '../../actions/session.js';

import { Validators } from '../../common';

import './style.css';

class Login extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    store: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    sessionActions: PropTypes.object.isRequired
  };
  state = {
    email: '',
    password: ''
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
      <section id="login">
        <div className="container">
          <form className="form-horizontal">
            <h2>Please Login <small>You're just one step away!</small></h2>
            <hr className="colorgraph"/>
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
            <hr className="colorgraph"/>
            <div className="form-group">
              <div className="col-xs-offset-2 col-xs-10">
                <Link to="/lostPassword">Click here to recover your password.</Link>
              </div>
            </div>
            <div className="form-group">
              <div className="col-xs-offset-2 col-xs-10">
                <Button
                  bsStyle="success"
                  onClick={this.handleSubmit}
                  disabled={this.canSubmit()}>
                  ★LOGIN★
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
      default:
        return '';
    }
  };
  handleOnChange = (e) => {
    const state = {};
    const key = e.target.name;
    if (this.refs[key]) {
      state[key] = this.refs[key].getValue();
      this.setState(state);
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { sessionActions } = this.props;
    const email = this.refs.email.getValue();
    const password = this.refs.password.getValue();
    sessionActions.login({
      email,
      password
    });
  };
  canSubmit = () => {
    try {
      const email = this.refs.email.getValue();
      const password = this.refs.password.getValue();
      const validState = Validators.isValidEmail(email) && Validators.isValidPassword(password);
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
    sessionActions: bindActionCreators(SessionActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
