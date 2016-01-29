'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import style from './style.css';

class Loader extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const { sessionIsFetching, isFetching } = this.props;
    let innerBar = <div></div>;
    if(sessionIsFetching || isFetching) {
      innerBar = <div>
        <div className={style.bar}></div>
        <div className={style.bar}></div>
        <div className={style.bar}></div>
      </div>;
    }
    return (
      <section id="loader">
        <div className={style['load-bar']}>
          {innerBar}
        </div>
      </section>
    );
  }
}

Loader.propTypes = {
  sessionIsFetching: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { session, data } = state;
  const { sessionIsFetching } = session;
  const { isFetching } = data;
  return {
    sessionIsFetching,
    isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Loader);
