import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
  componentDidMount: function() {
    document.title = 'Nemo';
  },
  render() {
    return (
      <div>
        <nav className='navbar navbar-default'>
          <div className='container-fluid'>
            <div className='navbar-header'>
                <Link to='/' className='navbar-brand'>Nemo</Link>
            </div>
            <ul className='nav navbar-nav'>
              <li>
                <Link to='/login'>User</Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className='container-fluid'>
          {this.props.children}
        </div>
      </div>
    );
  }
});
