'use strict';

import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

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
      <section id="counter">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <p>
                Clicked: <strong>{counter}</strong> Times!
              </p>
              <div className="btn-group" role="group" aria-label="...">
                <Button bsStyle="success" onClick={actions.increment}>
                  <i className="fa fa-fw fa-plus"></i> Increment
                </Button>
                <Button bsStyle="warning" onClick={actions.decrement}>
                  <i className="fa fa-fw fa-minus"></i> Decrement
                </Button>
                <Button bsStyle="info" onClick={actions.incrementIfOdd}>
                  <i className="fa fa-fw fa-plus"></i> Increment (Odd)
                </Button>
                <Button bsStyle="danger" onClick={() => actions.incrementAsync()}>
                  <i className="fa fa-fw fa-plus"></i> Increment (Async)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Counter.propTypes = {
  counter: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired
};

export default Counter;
