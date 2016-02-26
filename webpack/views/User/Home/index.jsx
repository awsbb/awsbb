import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { routerActions } from 'react-router-redux';

import './style.css';

class Home extends React.Component {
  displayName = 'Home'
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
    const { push } = this.props;
    return (
      <section id='user-home'>
        <div className='container'>
          <h1>{'USER HOME'}</h1>
          <Button bsClass='btn' bsStyle='primary' onClick={() => push('/')}>
            {'★GO HOME★'}
          </Button>
          <Link to='/user/changePassword'>{'Click here to change your password.'}</Link>
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
    push: bindActionCreators(routerActions.push, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
