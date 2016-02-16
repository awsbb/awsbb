import React, { PropTypes } from 'react';
import { Button, Input } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';
import FontAwesome from 'react-fontawesome';

import * as DataActions from '../../actions/data.js';

import { Validators } from '../../common';

import './style.css';

class LostPassword extends React.Component {
  displayName = 'LostPassword'
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
    password: ''
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
    dataActions.queryAPI({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/AuthLostPassword',
      data: {
        email
      },
      successRoute: '/thanks?type=LostPassword'
    });
  }
  canSubmit = () => {
    try {
      const email = this._email.getValue();
      const validState = Validators.isValidEmail(email);
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
    return (
      <section id='login'>
        <div className='container'>
          <form className='form-horizontal'>
            <h2>{'Forgot Already? '}<small>{'Don\'t worry; the reset is painless.'}</small></h2>
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
            <hr className='colorgraph'/>
            <div className='form-group'>
              <div className='col-xs-offset-2 col-xs-10'>
                <Button bsStyle='success' disabled={this.canSubmit()} onClick={this.handleSubmit}>
                  {'★SEND E-MAIL★'}
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

export default connect(mapStateToProps, mapDispatchToProps)(LostPassword);
