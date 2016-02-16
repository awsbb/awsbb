import React, { PropTypes } from 'react';
import { Button, Input } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';
import FontAwesome from 'react-fontawesome';

import * as DataActions from '../../actions/data.js';

import { Validators } from '../../common';

import './style.css';

class Register extends React.Component {
  displayName = 'Register'
  static propTypes = {
    dataActions: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    push: PropTypes.func.isRequired,
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
    password: '',
    confirmation: ''
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
    if(this[`_${key}`]) {
      state[key] = this[`_${key}`].getValue();
      this.setState(state);
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { dataActions } = this.props;
    const email = this._email.getValue();
    const password = this._password.getValue();
    const confirmation = this._confirmation.getValue();
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
  }
  canSubmit = () => {
    try {
      const email = this._email.getValue();
      const password = this._password.getValue();
      const confirmation = this._confirmation.getValue();
      const validState = Validators.isValidEmail(email) && Validators.isValidPassword(password) && Validators.isValidConfirmation({ password, confirmation });
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
    const envelope = <FontAwesome fixedWidth name='envelope'/>;
    const lock = <FontAwesome fixedWidth name='lock'/>;
    return (
      <section id='register'>
        <div className='container'>
          <form className='form-horizontal'>
            <h2>{'Please Register '}<small>{'It\'s free and always will be.'}</small></h2>
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
                <Button
                  bsStyle='success' disabled={this.canSubmit()} onClick={this.handleSubmit}>
                  {'★REGISTER★'}
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);
