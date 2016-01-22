'use strict';

import React, { PropTypes } from 'react';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Header from '../../components/Header';
import Message from '../../components/Message';
import Main from '../Main';
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
    const { children, isAuthenticated, errorMessage } = this.props;
    return (
      <div>
        <Header isAuthenticated={isAuthenticated}/>
        <Message message={errorMessage}/>
        <Main children={children}></Main>
        <Footer/>
      </div>
    );
  }
}

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string
};

function mapStateToProps(state) {
  const { authorize } = state;
  const { isAuthenticated, errorMessage } = authorize;
  return {
    isAuthenticated,
    errorMessage
  };
}

// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators(Actions, dispatch)
//   };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(App);
export default connect(mapStateToProps)(App);
