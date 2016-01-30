import React, { PropTypes } from 'react';
import { Button, Input } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { routeActions } from 'redux-simple-router';
import FontAwesome from 'react-fontawesome';

import { SessionActions } from '../../actions';

import { Validators } from '../../common';

import './style.css';

class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.resolveStyleFromState = this.resolveStyleFromState.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillUpdate(nextProps) {
    const { session, push } = nextProps;
    if (!session.isFetching) {
      const response = session.data;
      if (response && response.success) {
        return push('/');
      }
    }
  }
  componentWillMount() {
    const { push, isAuthenticated } = this.props;
    if (isAuthenticated) {
      return push('/');
    }
    this.setState({
      email: '',
      password: ''
    });
  }
  render() {
    const envelope = <FontAwesome name="envelope" fixedWidth/>;
    const lock = <FontAwesome name="lock" fixedWidth/>;
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
    const state = {};
    const key = e.target.name;
    if (this.refs[key]) {
      state[key] = this.refs[key].getValue();
      this.setState(state);
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    const { sessionActions } = this.props;
    const email = this.refs.email.getValue();
    const password = this.refs.password.getValue();
    sessionActions.login({
      email,
      password
    });
  }
  canSubmit() {
    try {
      const email = this.refs.email.getValue();
      const password = this.refs.password.getValue();
      const validState = Validators.isValidEmail(email) && Validators.isValidPassword(password);
      return !validState;
    } catch (e) {
      return true;
    }
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { session } = state;
  const { isAuthenticated } = session;
  return {
    isAuthenticated,
    session
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    push: bindActionCreators(routeActions.push, dispatch),
    sessionActions: bindActionCreators(SessionActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
