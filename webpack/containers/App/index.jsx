'use strict';

import React, { PropTypes } from 'react';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Header from '../../components/Header';
import Message from '../../components/Message';
import Footer from '../../components/Footer';

import './style.css';

class App extends React.Component {
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
    const { children, isAuthenticated, message, dispatch } = this.props;
    return (
      <div>
        <Header isAuthenticated={isAuthenticated}/>
        <Message message={message}/>
        <section id="main">
          <div className="container">
            <div className="row">
              <div className="col-xs-12">
                {children}
              </div>
            </div>
          </div>
        </section>
        <Footer/>
      </div>
    );
  }
}

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  message: PropTypes.string
};

function mapStateToProps(state) {
  const { authorize } = state;
  const { isAuthenticated, message } = authorize;
  return {
    isAuthenticated,
    message
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
