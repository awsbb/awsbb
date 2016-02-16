import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';

import './style.css';

class Footer extends React.Component {
  displayName = 'Footer'
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
    return (
      <section id='footer'>
        <div className='container'>
          <hr/>
          <div className='row'>
            <div className='col-sm-3'>
              <div>
                {'FOOTER #1'}
              </div>
              <div>
                {'Content'}
              </div>
            </div>
            <div className='col-sm-3'>
              <div>
                {'FOOTER #2'}
              </div>
              <div>
                {'Content'}
              </div>
            </div>
            <div className='col-sm-3'>
              <div>
                {'FOOTER #3'}
              </div>
              <div>
                {'Content'}
              </div>
            </div>
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
    push: bindActionCreators(routeActions.push, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
