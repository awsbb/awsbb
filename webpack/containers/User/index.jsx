'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Loader from '../../components/Loader';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import './style.css';

class User extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const { children, isAuthenticated, isFetching } = this.props;
    return (
      <div>
        <Loader isFetching={isFetching}/>
        <Header isAuthenticated={isAuthenticated}/>
        <section id="main">
          {children}
        </section>
        <Footer/>
      </div>
    );
  }
}

User.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  const { authorize } = state;
  const { isAuthenticated, isFetching } = authorize;
  return {
    isAuthenticated,
    isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
