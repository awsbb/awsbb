'use strict';

import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import './style.css';

class Thanks extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.stateChanged = this.stateChanged.bind(this);
  }
  stateChanged() {

  }
  componentWillMount() {

  }
  componentDidMount() {

  }
  componentWillUnmount() {

  }
  render() {
    const { push, location } = this.props;
    var button = <Button
      bsClass="btn"
      bsStyle="primary"
      onClick={() => push('/')}>
      ★　GO HOME　★
    </Button>;
    switch(location.query.type) {
      case 'CreateUser':
        return (
          <section id="thanks">
            <p>
              Thanks for registering! Check your email.
            </p>
            <p>
              A verification message has been sent and must be completed before you can login.
            </p>
            {button}
          </section>
        );
      default:
        return (
          <section id="thanks">
            <p>
              Everyone should be thanked for something at least.
            </p>
            <p>
              So... in the name of happiness and all things fuzzy; Thanks!
            </p>
            {button}
          </section>
        );
    }
  }
}

Thanks.propTypes = {};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    push: bindActionCreators(routeActions.push, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Thanks);
