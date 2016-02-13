import React, { PropTypes } from 'react';
import { Button, Input } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';
import FontAwesome from 'react-fontawesome';

import * as DataActions from '../../../actions/data.js';

import { Validators } from '../../../common';

import './style.css';

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    store: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    dataActions: PropTypes.object.isRequired
  };
  state = {
    currentPassword: '',
    password: '',
    confirmation: ''
  };
  render = () => {
    const { isAuthenticated } = this.props;
    const lock = <FontAwesome name="lock" fixedWidth/>;
    if(isAuthenticated) {
      return (
        <section id="user-change-password">
          <div className="container">
            <form className="form-horizontal">
              <h2>Time for a change! <small>Just remember you have to log back in.</small></h2>
              <hr className="colorgraph"/>
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
              <hr className="colorgraph"/>
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
  };
  resolveStyleFromState = (type) => {
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
    const { store, dataActions } = this.props;
    const email = store.session.user.email;
    const currentPassword = this.refs.currentPassword.getValue();
    const password = this.refs.password.getValue();
    const confirmation = this.refs.confirmation.getValue();
    dataActions.queryAPIThenLogout({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/AuthChangePassword',
      data: {
        email,
        currentPassword,
        password,
        confirmation
      },
      authenticated: true,
      successRoute: '/thanks?type=ChangePassword'
    });
  };
  canSubmit = () => {
    try {
      const currentPassword = this.refs.currentPassword.getValue();
      const password = this.refs.password.getValue();
      const confirmation = this.refs.confirmation.getValue();
      const validState = Validators.isValidPassword(currentPassword) && Validators.isValidPassword(password) && Validators.isValidConfirmation(password, confirmation);
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
