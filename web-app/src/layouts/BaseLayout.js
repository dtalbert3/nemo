import React, { PropTypes } from 'react'
import { Nav, Navbar, Grid } from 'react-bootstrap'
import { Link } from 'react-router'
import Auth from '../auth'

// Helper to create navigation links in page header
class NavLink extends React.Component {
  render () {
    var active = this.context.router.isActive(this.props.path)
      ? 'active' : ''
    // May need to fix some 'whitespace'
    return (
      <li role='presentation' className={active + this.props.hidden}>
        <Link to={this.props.path}> {this.props.label} </Link>
      </li>
    )
  }
}

NavLink.contextTypes = {
  router: React.PropTypes.object
}

NavLink.propTypes = {
  label: PropTypes.string,
  path: PropTypes.string,
  hidden: PropTypes.string
}

// Render app with navbar, alert, and container fluid for sub components
class BaseLayout extends React.Component {
  render () {
    return (
      <div id='base'>
        <div id="modal"></div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to='/user'>Nemo</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavLink path='/login' label='Login' hidden={!Auth.loggedIn() ? '' : ' hidden'} />
              <NavLink path='/user' label='User' hidden={Auth.loggedIn() ? '' : ' hidden'} />
              <NavLink path='/global' label='Global' hidden={Auth.loggedIn() ? '' : ' hidden'} />
              <NavLink path='/about' label='About' hidden='' />
            </Nav>
            <Nav pullRight>
              <NavLink path='/logout' label='Logout' hidden={Auth.loggedIn() ? '' : ' hidden'} />
            </Nav>
          </Navbar.Collapse>
          <div id='alert'/>
        </Navbar>
        <Grid fluid={true}>
          {this.props.children}
        </Grid>
      </div>
    )
  }
}

BaseLayout.propTypes = {
  children: PropTypes.object
}

export default BaseLayout
