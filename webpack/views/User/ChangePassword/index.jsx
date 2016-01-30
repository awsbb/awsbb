import React, { PropTypes } from 'react';
import { Button, Input } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';
import FontAwesome from 'react-fontawesome';

import * as Actions from '../../../actions';

import { Validators } from '../../../common';

import './style.css';

class ChangePassword extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.resolveStyleFromState = this.resolveStyleFromState.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillMount() {
    this.setState({
      currentPassword: '',
      password: '',
      confirmation: ''
    });
  }
  render() {
    const { isAuthenticated } = this.props;
    const lock = <FontAwesome name="lock" fixedWidth/>;
    if(isAuthenticated) {
      return (
        <section id="user-change-password">
          <div className="container">
            <form className="form-horizontal">
              <Input
                type="password"
                value={this.state.currentPassword}
                placeholder="Current Password"
                label="Current Password:"
                help="Validation is based on string length."
                bsStyle={this.resolveStyleFromState('currentPassword')}
                hasFeedback
                name="currentPassword"
                ref="currentPassword"
                labelClassName="col-xs-2"
                onChange={this.handleOnChange}
                addonBefore={lock}
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
                    ★CHANGE PASSWORD★
                  </Button>
                </div>
              </div>
            </form>
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
  resolveStyleFromState(type) {
    switch (type) {
      case 'currentPassword':
        return Validators.getPasswordValidationClass(this.state.currentPassword);
      case 'password':
        return Validators.getPasswordValidationClass(this.state.password);
      case 'confirmation':
        return Validators.getConfirmationValidationClass(this.state.password, this.state.confirmation);
      default:
        return '';
    }
  }
  handleOnChange(e) {
    const state = {};
    const key = e.target.name;
    if(this.refs[key]) {
      state[key] = this.refs[key].getValue();
      this.setState(state);
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    const { store, actions } = this.props;
    const email = store.user.email;
    const currentPassword = this.refs.currentPassword.getValue();
    const password = this.refs.password.getValue();
    const confirmation = this.refs.confirmation.getValue();
    actions.queryAPI({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/AuthChangePassword',
      data: {
        email,
        currentPassword,
        password,
        confirmation
      },
      authenticated: true,
      forceLogout: true,
      resolveRoute: '/thanks?type=ChangePassword'
    });
  }
  canSubmit() {
    try {
      const currentPassword = this.refs.currentPassword.getValue();
      const password = this.refs.password.getValue();
      const confirmation = this.refs.confirmation.getValue();
      const validState = Validators.isValidPassword(currentPassword) && Validators.isValidPassword(password) && Validators.isValidConfirmation(password, confirmation);
      return !validState;
    } catch (e) {
      return true;
    }
  }
}

ChangePassword.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  store: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { store } = state;
  const { isAuthenticated, isFetching } = store;
  return {
    isAuthenticated,
    isFetching,
    store
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    push: bindActionCreators(routeActions.push, dispatch),
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
