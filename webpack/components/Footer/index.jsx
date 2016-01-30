import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import './style.css';

class Footer extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (
      <section id="footer">
        <div className="container">
          <hr/>
          <div className="row">
            <div className="col-sm-3">
              <div>
                FOOTER #1
              </div>
              <div>
                Content
              </div>
            </div>
            <div className="col-sm-3">
              <div>
                FOOTER #2
              </div>
              <div>
                Content
              </div>
            </div>
            <div className="col-sm-3">
              <div>
                FOOTER #3
              </div>
              <div>
                Content
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Footer.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
