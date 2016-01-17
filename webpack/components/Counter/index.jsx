'use strict';

import React, { PropTypes } from 'react';

import './style.css';

class Counter extends React.Component {
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
    const { actions, counter } = this.props;
    return (
      <p>
        Clicked: {counter} times
        {' '}
        <button onClick={actions.increment}>+</button>
        {' '}
        <button onClick={actions.decrement}>-</button>
        {' '}
        <button onClick={actions.incrementIfOdd}>Increment if odd</button>
        {' '}
        <button onClick={() => actions.incrementAsync()}>Increment async</button>
      </p>
    );
  }
}

Counter.propTypes = {
  counter: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired
};

export default Counter;
