import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { routeActions } from 'redux-simple-router';

import './style.css';

class Home extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const { push } = this.props;
    return (
      <section id="user-home">
        <div className="container">
          <h1>USER HOME</h1>
          <Button
            bsClass="btn"
            bsStyle="primary"
            onClick={() => push('/')}>
            ★GO HOME★
          </Button>
          <Link to="/user/changePassword">Click here to change your password.</Link>
        </div>
      </section>
    );
  }
}

Home.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  store: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { store } = state;
  const { isAuthenticated, isFetching } = store;
  return {
    isAuthenticated,
    isFetching,
    store
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    push: bindActionCreators(routeActions.push, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
