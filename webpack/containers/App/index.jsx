import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Loader from '../../components/Loader';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import './style.css';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const { children } = this.props;
    return (
      <div>
        <Loader/>
        <Header/>
        <section id="main">
          {children}
        </section>
        <Footer/>
      </div>
    );
  }
}

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  const { store } = state;
  const { isAuthenticated, isFetching } = store;
  return {
    isAuthenticated,
    isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
