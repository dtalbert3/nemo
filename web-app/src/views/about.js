import React from 'react'
import { Link } from 'react-router'

// 404 Page, contains redirect button to home
class About extends React.Component {

  // Once page is mounted attach page title
  componentDidMount () {
    document.title = 'Nemo About'
  }

  // Render 404 page
  render () {
    return (
      <div className='container'>
        Information about NEMO project goes here.
      </div>

    )
  }
}

export default About
