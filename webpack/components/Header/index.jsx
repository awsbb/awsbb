import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';

import * as SessionActions from '../../actions/session.js';

import './style.css';

class Header extends React.Component {
  displayName = 'Header'
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    push: PropTypes.func.isRequired,
    sessionActions: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
  }
  handleLogout = (e) => {
    e.preventDefault();
    const { sessionActions } = this.props;
    sessionActions.logout();
  }
  handleNavigation = (selectedKey = '') => {
    const { push } = this.props;
    push(`/${selectedKey}`);
  }
  render = () => {
    const { isAuthenticated } = this.props;
    let UserNaviation = (
      <Nav onSelect={this.handleNavigation} pullRight>
        <NavItem eventKey={'login'}>
          <i className='fa fa-fw fa-sign-in'></i> {'Login'}
        </NavItem>
        <NavItem eventKey={'register'}>
          <i className='fa fa-fw fa-key'></i> {'Register'}
        </NavItem>
      </Nav>
    );
    if(isAuthenticated) {
      UserNaviation = (
        <Nav onSelect={this.handleNavigation} pullRight>
          <NavItem eventKey={'user'}>
            <i className='fa fa-fw fa-user'></i> {'Account'}
          </NavItem>
          <NavItem onClick={this.handleLogout}>
            <i className='fa fa-fw fa-sign-out'></i> {'Logout'}
          </NavItem>
        </Nav>
      );
    }
    return (
      <Navbar staticTop>
        <Navbar.Header>
          <Navbar.Toggle/>
          <Navbar.Brand>
            <Link to='/'>{'awsBB'}</Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav onSelect={this.handleNavigation}>
            <NavItem>
              <i className='fa fa-fw fa-home'></i> {'Home'}
            </NavItem>
            <NavItem eventKey={'about'}>
              <i className='fa fa-fw fa-flag'></i> {'About'}
            </NavItem>
          </Nav>
          {UserNaviation}
        </Navbar.Collapse>
      </Navbar>
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
    push: bindActionCreators(routeActions.push, dispatch),
    sessionActions: bindActionCreators(SessionActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
