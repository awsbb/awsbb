import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import * as Actions from '../../actions';

import './style.css';

class Header extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleLogout = this.handleLogout.bind(this);
  }
  render() {
    const { push, isAuthenticated } = this.props;
    let UserNaviation = <Nav pullRight>
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
    const { actions } = this.props;
    actions.logout();
  }
}

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  store: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired
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
    push: bindActionCreators(routeActions.push, dispatch),
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
