import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';

import './style.css';

class NoMatch extends React.Component {
  displayName = 'NoMatch'
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    push: PropTypes.func.isRequired,
    store: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
  }
  render = () => {
    return (
      <section id='no-match'>
        <div className='container'>
          <h1>{'404'}</h1>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  const { store } = state;
  const { data, session } = store;
  const { isAuthenticated } = session;
  return {
    isAuthenticated,
    isFetching: data.isFetching || session.isFetching,
    store
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    push: bindActionCreators(routeActions.push, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NoMatch);
