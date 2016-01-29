'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import { SessionActions } from '../../actions';

import './style.css';

class Header extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleLogout = this.handleLogout.bind(this);
  }
  render() {
    const { push, isAuthenticated } = this.props;
    var UserNaviation = <Nav pullRight>
      <NavItem onClick={() => push('/login')}>
        <i className="fa fa-fw fa-sign-in"></i> Login
      </NavItem>
      <NavItem onClick={() => push('/register')}>
        <i className="fa fa-fw fa-key"></i> Register
      </NavItem>
    </Nav>;
    if(isAuthenticated) {
      UserNaviation = <Nav pullRight>
        <NavItem onClick={() => push('/user')}>
          <i className="fa fa-fw fa-user"></i> Account
        </NavItem>
        <NavItem onClick={() => {this.handleLogout();}}>
          <i className="fa fa-fw fa-sign-out"></i> Logout
        </NavItem>
      </Nav>;
    }
    return (
      <Navbar staticTop={true}>
        <Navbar.Header>
          <Navbar.Toggle/>
          <Navbar.Brand>
            <Link to="/">awsBB</Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem onClick={() => push('/')}>
              <i className="fa fa-fw fa-home"></i> Home
            </NavItem>
            <NavItem onClick={() => push('/about')}>
              <i className="fa fa-fw fa-flag"></i> About
            </NavItem>
          </Nav>
          {UserNaviation}
        </Navbar.Collapse>
      </Navbar>
    );
  }
  handleLogout() {
    const { push, sessionActions } = this.props;
    sessionActions.logout()
      .then(() => {
        push('/');
      });
  }
}

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { session } = state;
  const { isAuthenticated, sessionIsFetching } = session;
  return {
    isAuthenticated,
    sessionIsFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    push: bindActionCreators(routeActions.push, dispatch),
    sessionActions: bindActionCreators(SessionActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
