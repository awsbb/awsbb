import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import './style.css';

class Home extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    store: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  };
  render = () => {
    const { push } = this.props;
    return (
      <section id="home">
        <div className="container">
          <h1>HOME</h1>
          <Button
            bsClass="btn"
            bsStyle="primary"
            onClick={() => push('/')}>
            ★GO HOME★
          </Button>
        </div>
      </section>
    );
  };
}

const mapStateToProps = (state) => {
  const { store } = state;
  const { isAuthenticated, isFetching } = store;
  return {
    isAuthenticated,
    isFetching,
    store
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    push: bindActionCreators(routeActions.push, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
