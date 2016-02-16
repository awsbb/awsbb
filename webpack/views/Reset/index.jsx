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
  displayName = 'Reset'
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
    email: '',
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
    const { location, dataActions } = this.props;
    const email = location.query.email;
    const lost = location.query.lost;
    const password = this._password.getValue();
    const confirmation = this._confirmation.getValue();
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
  }
  canSubmit = () => {
    const { location } = this.props;
    try {
      const email = location.query.email;
      const token = location.query.lost;
      const password = this._password.getValue();
      const confirmation = this._confirmation.getValue();
      const validState = Validators.isValidEmail(email) && Validators.isValidPassword(password) && Validators.isValidConfirmation({ password, confirmation }) && token;
      return !validState;
    } catch (e) {
      return true;
    }
  }
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
  }
  render = () => {
    const lock = <FontAwesome fixedWidth name='lock'/>;
    return (
      <section id='register'>
        <div className='container'>
          <form className='form-horizontal'>
            <h2>{'Almost Done '}<small>{'Just enter in your new password and off we go!'}</small></h2>
            <hr className='colorgraph'/>
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
                  {'★RESET★'}
                </Button>
              </div>
            </div>
          </form>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Reset);
