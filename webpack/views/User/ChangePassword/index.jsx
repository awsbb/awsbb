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
  displayName = 'ChangePassword'
  static propTypes = {
    dataActions: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    push: PropTypes.func.isRequired,
    store: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
  }
  state = {
    currentPassword: '',
    password: '',
    confirmation: ''
  }
  handleOnChange = (e) => {
    const state = {};
    const key = e.target.name;
    if(this[`_${key}`]) {
      state[key] = this[`_${key}`].getValue();
      this.setState(state);
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { store, dataActions } = this.props;
    const email = store.session.user.email;
    const currentPassword = this._currentPassword.getValue();
    const password = this._password.getValue();
    const confirmation = this._confirmation.getValue();
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
  }
  canSubmit = () => {
    try {
      const currentPassword = this._currentPassword.getValue();
      const password = this._password.getValue();
      const confirmation = this._confirmation.getValue();
      const validState = Validators.isValidPassword(currentPassword) && Validators.isValidPassword(password) && Validators.isValidConfirmation(password, confirmation);
      return !validState;
    } catch (e) {
      return true;
    }
  }
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
  }
  render = () => {
    const { isAuthenticated } = this.props;
    const lock = <FontAwesome fixedWidth name='lock'/>;
    if(isAuthenticated) {
      return (
        <section id='user-change-password'>
          <div className='container'>
            <form className='form-horizontal'>
              <h2>{'Time for a change! '}<small>{'Just remember you have to log back in.'}</small></h2>
              <hr className='colorgraph'/>
              <Input
                addonBefore={lock}
                bsStyle={this.resolveStyleFromState('currentPassword')}
                hasFeedback
                help='Validation is based on string length.'
                label='Current Password:'
                labelClassName='col-xs-2'
                name='currentPassword'
                onChange={this.handleOnChange}
                placeholder='Current Password'
                ref={(ref) => {
                  this._currentPassword = ref;
                }}
                type='password'
                value={this.state.currentPassword}
                wrapperClassName='col-xs-10'/>
              <Input
                addonBefore={lock}
                bsStyle={this.resolveStyleFromState('password')}
                hasFeedback
                help='Validation is based on string length.'
                label='Password:'
                labelClassName='col-xs-2'
                name='password'
                onChange={this.handleOnChange}
                placeholder='Password'
                ref={(ref) => {
                  this._password = ref;
                }}
                type='password'
                value={this.state.password}
                wrapperClassName='col-xs-10'/>
              <Input
                addonBefore={lock}
                bsStyle={this.resolveStyleFromState('confirmation')}
                hasFeedback
                help='Validation is based on matching the first entry.'
                label='Confirmation:'
                labelClassName='col-xs-2'
                name='confirmation'
                onChange={this.handleOnChange}
                placeholder='Confirmation'
                ref={(ref) => {
                  this._confirmation = ref;
                }}
                type='password'
                value={this.state.confirmation}
                wrapperClassName='col-xs-10'/>
              <hr className='colorgraph'/>
              <div className='form-group'>
                <div className='col-xs-offset-2 col-xs-10'>
                  <Button bsStyle='success' disabled={this.canSubmit()} onClick={this.handleSubmit}>
                    {'★CHANGE PASSWORD★'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </section>
      );
    }
    return (
      <section id='profile'>
        {'You can\'t view this page unless you are logged in.'}
      </section>
    );
  }
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
