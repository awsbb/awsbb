import React, { PropTypes } from 'react';
import { Button, Input } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { routerActions } from 'react-router-redux';
import FontAwesome from 'react-fontawesome';

import * as SessionActions from '../../actions/session.js';

import { Validators } from '../../common';

import './style.css';

class Login extends React.Component {
  displayName = 'Login'
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    push: PropTypes.func.isRequired,
    sessionActions: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  }
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  constructor(props, context) {
    super(props, context);
  }
  state = {
    email: '',
    password: ''
  }
  componentWillMount = () => {
    const { isAuthenticated, push } = this.props;
    if (isAuthenticated) {
      push('/');
    }
  }
  handleOnChange = (e) => {
    const state = {};
    const key = e.target.name;
    if (this[`_${key}`]) {
      state[key] = this[`_${key}`].getValue();
      this.setState(state);
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { sessionActions } = this.props;
    const email = this._email.getValue();
    const password = this._password.getValue();
    sessionActions.login({
      email,
      password
    });
  }
  canSubmit = () => {
    try {
      const email = this._email.getValue();
      const password = this._password.getValue();
      const validState = Validators.isValidEmail(email) && Validators.isValidPassword(password);
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
      default:
        return '';
    }
  }
  render = () => {
    const envelope = <FontAwesome fixedWidth name='envelope'/>;
    const lock = <FontAwesome fixedWidth name='lock'/>;
    return (
      <section id='login'>
        <div className='container'>
          <form className='form-horizontal'>
            <h2>{'Please Login '}<small>{'You\'re just one step away!'}</small></h2>
            <hr className='colorgraph'/>
            <Input
              addonBefore={envelope}
              bsStyle={this.resolveStyleFromState('email')}
              hasFeedback
              help='Validation is based on a simple regex.'
              label='Email Address:'
              labelClassName='col-xs-2'
              name='email'
              onChange={this.handleOnChange}
              placeholder='Enter email'
              ref={(ref) => {
                this._email = ref;
              }}
              type='email'
              value={this.state.email}
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
            <hr className='colorgraph'/>
            <div className='form-group'>
              <div className='col-xs-offset-2 col-xs-10'>
                <Link to='/lostPassword'>{'Click here to recover your password.'}</Link>
              </div>
            </div>
            <div className='form-group'>
              <div className='col-xs-offset-2 col-xs-10'>
                <Button bsStyle='success' disabled={this.canSubmit()} onClick={this.handleSubmit}>
                  {'★LOGIN★'}
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
    push: bindActionCreators(routerActions.push, dispatch),
    sessionActions: bindActionCreators(SessionActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
