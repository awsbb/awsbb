import React, { PropTypes } from 'react';
import { Button, Input } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';
import FontAwesome from 'react-fontawesome';

import * as DataActions from '../../actions/data.js';

import { Validators } from '../../common';

import './style.css';

class Reset extends React.Component {
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
    email: '',
    password: '',
    confirmation: ''
  };
  render = () => {
    const lock = <FontAwesome name="lock" fixedWidth/>;
    return (
      <section id="register">
        <div className="container">
          <form className="form-horizontal">
            <h2>Almost Done <small>Just enter in your new password and off we go!</small></h2>
            <hr className="colorgraph"/>
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
                  ★RESET★
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
      case 'confirmation': {
        const password = this.state.password;
        const confirmation = this.state.confirmation;
        return Validators.getConfirmationValidationClass({ password, confirmation });
      }
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
    const { location, dataActions } = this.props;
    const email = location.query.email;
    const lost = location.query.lost;
    const password = this.refs.password.getValue();
    const confirmation = this.refs.confirmation.getValue();
    dataActions.queryAPIThenLogout({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/AuthResetPassword',
      data: {
        email,
        lost,
        password,
        confirmation
      },
      successRoute: '/thanks?type=ResetPassword'
    });
  };
  canSubmit = () => {
    const { location } = this.props;
    try {
      const email = location.query.email;
      const token = location.query.lost;
      const password = this.refs.password.getValue();
      const confirmation = this.refs.confirmation.getValue();
      const validState = Validators.isValidEmail(email) && Validators.isValidPassword(password) && Validators.isValidConfirmation({ password, confirmation }) && token;
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

export default connect(mapStateToProps, mapDispatchToProps)(Reset);
