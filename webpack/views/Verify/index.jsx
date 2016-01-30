import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import * as Actions from '../../actions';

import './style.css';

class Verify extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    store: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired
  };
  componentWillMount = () => {
    const { location, actions } = this.props;
    const email = location.query.email;
    const verify = location.query.verify;
    actions.queryAPI({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/AuthVerifyUser',
      data: {
        email,
        verify
      },
      successRoute: '/thanks?type=VerifyUser'
    });
  };
  render = () => {
    return (
      <section id="verify">
        <div className="container">
          <div>
            <p>
              Verifying your token...
            </p>
          </div>
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
    push: bindActionCreators(routeActions.push, dispatch),
    actions: bindActionCreators(Actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
