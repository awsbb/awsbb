'use strict';

import React from 'react';
import { Link } from 'react-router';
// import { Navbar, NavItem, Nav } from 'react-bootstrap';
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
    // const { push } = this.props;
    // <Navbar staticTop={true}>
    //   <Navbar.Header>
    //     <Navbar.Toggle/>
    //     <Navbar.Brand>
    //       <Link to="/">awsBB</Link>
    //     </Navbar.Brand>
    //   </Navbar.Header>
    //   <Navbar.Collapse>
    //     <Nav>
    //       <NavItem onClick={() => push('/')}>
    //         <i className="fa fa-fw fa-home"></i> Home
    //       </NavItem>
    //       <NavItem onClick={() => push('/about')}>
    //         <i className="fa fa-fw fa-flag"></i> About
    //       </NavItem>
    //     </Nav>
    //     <Nav pullRight>
    //       <NavItem onClick={() => push('/login')}>
    //         <i className="fa fa-fw fa-sign-in"></i> Login
    //       </NavItem>
    //       <NavItem onClick={() => push('/register')}>
    //         <i className="fa fa-fw fa-key"></i> Register
    //       </NavItem>
    //     </Nav>
    //   </Navbar.Collapse>
    // </Navbar>
    return (
      <nav className="navbar navbar-default navbar-static-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link className="navbar-brand" to="/">awsBB</Link>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              <li>
                <Link to="/">
                  <i className="fa fa-fw fa-home"></i> Home
                </Link>
              </li>
              <li>
                <Link to="/about">
                  <i className="fa fa-fw fa-flag"></i> About
                </Link>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <Link to="/login">
                  <i className="fa fa-fw fa-sign-in"></i> Login
                </Link>
              </li>
              <li>
                <Link to="/register">
                  <i className="fa fa-fw fa-key"></i> Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default connect(
  null,
  {
    push: routeActions.push
  }
)(Header);
