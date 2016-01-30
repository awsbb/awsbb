import React, { PropTypes } from 'react';
import { Button, Input, Alert } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';
import FontAwesome from 'react-fontawesome';

import { DataActions } from '../../actions';

import { Validators } from '../../common';

import './style.css';

class Reset extends React.Component {
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
        return push('/thanks?type=ResetPassword');
      }
    }
  }
  componentWillMount() {
    this.setState({
      email: '',
      password: '',
      confirmation: ''
    });
  }
  render() {
    const lock = <FontAwesome name="lock" fixedWidth/>;
    return (
      <section id="register">
        <div className="container">
          <form className="form-horizontal">
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
                  ★RESET★
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
  handleSubmit() {
    const { dataActions, location } = this.props;
    const email = location.query.email;
    const lost = location.query.lost;
    const password = this.refs.password.getValue();
    const confirmation = this.refs.confirmation.getValue();
    dataActions.postData({
      url: 'http://127.0.0.1:3000/api/AuthResetPassword',
      data: {
        email,
        lost,
        password,
        confirmation
      }
    });
  }
  canSubmit() {
    const { location } = this.props;
    try {
      const email = location.query.email;
      const token = location.query.lost;
      const password = this.refs.password.getValue();
      const confirmation = this.refs.confirmation.getValue();
      const validState = Validators.isValidEmail(email) && Validators.isValidPassword(password) && Validators.isValidConfirmation(password, confirmation) && token;
      return !validState;
    } catch (e) {
      return true;
    }
  }
}

Reset.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Reset);
