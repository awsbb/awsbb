import React, { PropTypes } from 'react';
import { Button, Input } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';
import FontAwesome from 'react-fontawesome';

import { DataActions } from '../../actions';

import { Validators } from '../../common';

import './style.css';

class LostPassword extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.resolveStyleFromState = this.resolveStyleFromState.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillUpdate(nextProps) {
    const { data, dataActions, push } = nextProps;
    if (!data.isFetching) {
      const response = data.data;
      if (response && response.success) {
        dataActions.clear();
        return push('/thanks?type=LostPassword');
      }
    }
  }
  componentWillMount() {
    this.setState({
      email: '',
      password: ''
    });
  }
  render() {
    const envelope = <FontAwesome name="envelope" fixedWidth/>;
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
    if(this.refs[key]) {
      state[key] = this.refs[key].getValue();
      this.setState(state);
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    const { dataActions } = this.props;
    const email = this.refs.email.getValue();
    dataActions.postAPI({
      url: 'http://127.0.0.1:3000/api/AuthLostPassword',
      data: {
        email
      }
    });
  }
  canSubmit() {
    try {
      const email = this.refs.email.getValue();
      const validState = Validators.isValidEmail(email);
      return !validState;
    } catch (e) {
      return true;
    }
  }
}

LostPassword.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { data } = state;
  return {
    data
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    push: bindActionCreators(routeActions.push, dispatch),
    dataActions: bindActionCreators(DataActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LostPassword);
