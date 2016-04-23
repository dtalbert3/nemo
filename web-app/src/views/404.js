import React from 'react'
import { Link } from 'react-router'

// 404 Page, contains redirect button to home
class FourOhFour extends React.Component {

  // Once page is mounted attach page title
  componentDidMount () {
    document.title = '404'
  }

  // Render 404 page
  render () {
    return (
      <div className='container'>
        <div className='row'>
            <div className='col-md-12'>
              <div className='error-template'>
                <h1>We Lost Nemo</h1>
                <h2>404 Not Found</h2>
                <div className='error-details'>
                  Sorry, an error has occured, Requested page not found!
                </div>
                <div className='error-actions'>
                  <Link to='/' className='btn btn-primary btn-lg'>
                    <span className='glyphicon glyphicon-home' /> Find Nemo
                  </Link>
                </div>
              </div>
            </div>
        </div>
      </div>
    )
  }
}

export default FourOhFour
