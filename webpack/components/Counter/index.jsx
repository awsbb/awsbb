'use strict';

import React, { PropTypes } from 'react';
import Button from '../Button';

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
      <div>
        <p>
          Clicked: <strong>{counter}</strong> Times!
        </p>
        <div className="btn-group" role="group" aria-label="...">
          <Button className='btn btn-success' onClick={actions.increment} text="Increment">
            <i className='fa fa-fw fa-plus'></i>
          </Button>
          <Button className='btn btn-warning' onClick={actions.decrement} text="Decrement">
            <i className='fa fa-fw fa-minus'></i>
          </Button>
          <Button className="btn btn-info" onClick={actions.incrementIfOdd} text="Increment (Odd)">
            <i className='fa fa-fw fa-plus'></i>
          </Button>
          <Button className="btn btn-danger" onClick={() => actions.incrementAsync()} text="Increment (Async)">
            <i className='fa fa-fw fa-plus'></i>
          </Button>
        </div>
      </div>
    );
  }
}

Counter.propTypes = {
  counter: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired
};

export default Counter;
