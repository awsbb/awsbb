'use strict';

import React, { PropTypes } from 'react';
import { Alert } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import './style.css';

class Message extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.stateChanged = this.stateChanged.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
  }
  stateChanged() {

  }
  componentWillMount() {
    this.setState({
      alertVisible: true
    });
  }
  componentDidMount() {

  }
  componentWillUnmount() {

  }
  render() {
    const { message, bsStyle = 'info' } = this.props;
    if (this.state.alertVisible && message) {
      return (
        <section id="message">
          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                <Alert bsStyle={bsStyle} onDismiss={this.handleAlertDismiss}>
                  <h4>Oh snap!</h4>
                  <p>{message}</p>
                </Alert>
              </div>
            </div>
          </div>
        </section>
      );
    }
    return (<section id="message"></section>);
  }
  handleAlertDismiss() {
    this.setState({
      alertVisible: false
    });
  }
}

Message.propTypes = {
  message: PropTypes.string,
  bsStyle: PropTypes.string
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    push: bindActionCreators(routeActions.push, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Message);
