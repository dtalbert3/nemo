import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router';

const NavLink = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },

  render() {
    return (
      <li role='presentation' className={this.context.router.isActive(this.props.path) ? 'active' : ''}>
        <Link to={this.props.path}>{this.props.label}</Link>
      </li>
    );
  }
});

export default React.createClass({
  componentDidMount: function() {
    document.title = 'Nemo';
  },

  render() {
    return (
      <div>
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
        </Navbar>
        <div className='container-fluid'>
          {this.props.children}
        </div>
      </div>
    );
  }
});
