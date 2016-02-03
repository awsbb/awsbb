import React, { PropTypes } from 'react';
import { Button, Input } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';
import FontAwesome from 'react-fontawesome';

import * as DataActions from '../../actions/data.js';

import { Validators } from '../../common';

import './style.css';

class LostPassword extends React.Component {
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
    password: ''
  };
  render = () => {
    const envelope = <FontAwesome name="envelope" fixedWidth/>;
    return (
      <section id="login">
        <div className="container">
          <form className="form-horizontal">
            <h2>Forgot Already? <small>Don't worry; the reset is painless.</small></h2>
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
            <hr className="colorgraph"/>
            <div className="form-group">
              <div className="col-xs-offset-2 col-xs-10">
                <Button
                  bsStyle="success"
                  onClick={this.handleSubmit}
                  disabled={this.canSubmit()}>
                  ★SEND E-MAIL★
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
    if(this.refs[key]) {
      state[key] = this.refs[key].getValue();
      this.setState(state);
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { dataActions } = this.props;
    const email = this.refs.email.getValue();
    dataActions.queryAPI({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/AuthLostPassword',
      data: {
        email
      },
      successRoute: '/thanks?type=LostPassword'
    });
  };
  canSubmit = () => {
    try {
      const email = this.refs.email.getValue();
      const validState = Validators.isValidEmail(email);
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

export default connect(mapStateToProps, mapDispatchToProps)(LostPassword);
