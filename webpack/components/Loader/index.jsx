import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import style from './style.css';

class Loader extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    store: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };
  render = () => {
    const { isFetching } = this.props;
    let innerBar = <div></div>;
    if(isFetching) {
      innerBar = <div>
        <div className={style.bar}></div>
        <div className={style.bar}></div>
        <div className={style.bar}></div>
      </div>;
    }
    return (
      <section id="loader">
        <div className={style['load-bar']}>
          {innerBar}
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
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loader);
