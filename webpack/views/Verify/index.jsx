import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';

import * as DataActions from '../../actions/data.js';

import './style.css';

class Verify extends React.Component {
  displayName = 'Verify'
  static propTypes = {
    dataActions: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    push: PropTypes.func.isRequired,
    store: PropTypes.object.isRequired
  }
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
  render = () => {
    return (
      <section id='verify'>
        <div className='container'>
          <div>
            <p>
              {'Verifying your token...'}
            </p>
          </div>
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
    push: bindActionCreators(routerActions.push, dispatch),
    dataActions: bindActionCreators(DataActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
