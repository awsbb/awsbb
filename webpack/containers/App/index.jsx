'use strict';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Header from '../../components/Header';
import Counter from  '../../components/Counter';
import Main from '../Main';
import Footer from '../../components/Footer';

import * as CounterActions from '../../actions/counter';

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
    const { children, counter, counterActions } = this.props;
    return (
      <div>
        <Header/>
        <Counter counter={counter} actions={counterActions}/>
        <Main children={children}></Main>
        <Footer/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch) {
  return {
    counterActions: bindActionCreators(CounterActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
