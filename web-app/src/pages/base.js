import React from 'react';
import { Nav, Navbar, Grid } from 'react-bootstrap';
import { Link } from 'react-router';

// Helper to create navigation links in page header
const NavLink = React.createClass({

  // Get context of app's router
  contextTypes: {
    router: React.PropTypes.object
  },

  // Render navigation link
  render() {
    return (
      <li role='presentation' className={this.context.router.isActive(this.props.path) ? 'active' : ''}>
        <Link to={this.props.path}>{this.props.label}</Link>
      </li>
    );
  }
});

// Base page containing app's skeleton (Navigation + Content Container)
export default React.createClass({

  // Once page is mounted attach page title
  componentDidMount() {
    document.title = 'Nemo';
  },

  // Render app skeleton
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to='/'>Nemo</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavLink path='/login' label='Login'/>
            <NavLink path='/user' label='User'/>
            <NavLink path='/global' label='Global'/>
          </Nav>
        </Navbar.Collapse>
        <div id='alert'/>
        <Grid fluid={true}>
          {this.props.children}
        </Grid>
      </Navbar>
    );
  }
});
