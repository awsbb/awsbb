import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';

import * as DataActions from '../../actions/data.js';

import './style.css';

class Verify extends React.Component {
  constructor(props) {
    super(props);

    const { location, dataActions } = props;
    const email = location.query.email;
    const verify = location.query.verify;
    
    dataActions.queryAPI({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/AuthVerifyUser',
      data: {
        email,
        verify
      },
      successRoute: '/thanks?type=VerifyUser'
    });
  }
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    store: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    dataActions: PropTypes.object.isRequired
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
    push: bindActionCreators(routeActions.push, dispatch),
    dataActions: bindActionCreators(DataActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
