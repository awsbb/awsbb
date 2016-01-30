import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import { DataActions } from '../../actions';

import './style.css';

class Verify extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillUpdate(nextProps) {
    const { data, dataActions, push } = nextProps;
    if (!data.isFetching) {
      const response = data.data;
      if (response && response.success) {
        dataActions.clear();
        return push('/thanks?type=VerifyUser');
      }
    }
  }
  componentWillMount() {
    const { location, dataActions } = this.props;
    const email = location.query.email;
    const verify = location.query.verify;
    dataActions.postAPI({
      url: 'http://127.0.0.1:3000/api/AuthVerifyUser',
      data: {
        email,
        verify
      }
    });
  }
  render() {
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
  }
}

Verify.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { data } = state;
  return {
    data
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    push: bindActionCreators(routeActions.push, dispatch),
    dataActions: bindActionCreators(DataActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
