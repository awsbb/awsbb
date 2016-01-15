'use strict';

import React from 'react';
import { connect } from 'react-redux';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import './style.css';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.stateChanged = this.stateChanged.bind(this);
  }
  stateChanged() {}
  onScroll(event) {
    console.log(event.srcElement.body.scrollTop);
  }
  componentWillMount() {
    window.addEventListener('scroll', this.onScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }
  render() {
    const { children } = this.props;
    return (
      <div>
        <Header/>
        <div className="container" id="content">
          {children}
        </div>
        <Footer/>
      </div>
    );
  }
}

export default connect()(App);
