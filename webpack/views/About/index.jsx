import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import './style.css';

class About extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const { push } = this.props;
    return (
      <section id="about">
        <div className="container">
          <h1>ABOUT</h1>
          <Button
            bsClass="btn"
            bsStyle="primary"
            onClick={() => push('/')}>
            ★GO HOME★
          </Button>
        </div>
      </section>
    );
  }
}

About.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
