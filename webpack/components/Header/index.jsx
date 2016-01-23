'use strict';

import React from 'react';
import { Link } from 'react-router';
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import './style.css';

class Header extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.stateChanged = this.stateChanged.bind(this);
  }
  stateChanged() {

  }
  componentWillMount() {

  }
  componentDidMount() {

  }
  componentWillUnmount() {

  }
  render() {
    const { push } = this.props;
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
          <Nav pullRight>
            <NavItem onClick={() => push('/login')}>
              <i className="fa fa-fw fa-sign-in"></i> Login
            </NavItem>
            <NavItem onClick={() => push('/register')}>
              <i className="fa fa-fw fa-key"></i> Register
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default connect(null, {
  push: routeActions.push
})(Header);
