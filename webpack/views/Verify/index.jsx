import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import { Alert } from 'react-bootstrap';
import { Rover } from '../../common';

import './style.css';

class Verify extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    const { push, location } = this.props;
    const email = location.query.email;
    const verify = location.query.verify;
    Rover.rover('http://127.0.0.1:3000/api/AuthVerifyUser', {
      method: 'POST',
      body: JSON.stringify({
        email,
        verify
      })
    })
    .then(() => push('/thanks?type=VerifyUser'))
    .catch(() => {});
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
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    push: bindActionCreators(routeActions.push, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
