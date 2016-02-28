import React from 'react';
import { Nav, Navbar, Grid } from 'react-bootstrap';
import { Link } from 'react-router';
import Auth from '../auth';

// Helper to create navigation links in page header
const NavLink = React.createClass({

  // Get context of app's router
  contextTypes: {
    router: React.PropTypes.object
  },

  // Render navigation link
  render() {
    var active = this.context.router.isActive(this.props.path) ?
      'active' : '';
    // May need to fix some 'whitespace'
    return (
      <li role='presentation' className={active + this.props.hidden}>
        <Link to={this.props.path}> {this.props.label} </Link>
      </li>
    );
  }
});

// Render app with navbar/alert and container fluid for sub components
export default React.createClass({

  // Render app skeleton
  render() {
    return (
      <div id='base'>
        <Navbar staticTop={true}>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to='/'>Nemo</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavLink path='/login' label='Login' hidden={!Auth.loggedIn() ? '' : ' hidden'} />
              <NavLink path='/user' label='User' hidden={Auth.loggedIn() ? '' : ' hidden'} />
              <NavLink path='/global' label='Global' hidden={Auth.loggedIn() ? '' : ' hidden'} />
            </Nav>
          </Navbar.Collapse>
          <div id='alert'/>
        </Navbar>
        <Grid fluid={true}>
          {this.props.children}
        </Grid>
      </div>
    );
  }
});
