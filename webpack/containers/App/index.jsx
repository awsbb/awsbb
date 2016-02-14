import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Loader from '../../components/Loader';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import './style.css';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    store: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };
  render = () => {
    const { children } = this.props;
    return (
      <div>
        <Loader/>
        <Header/>
        <section id="main">
          {children}
        </section>
        <Footer/>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
