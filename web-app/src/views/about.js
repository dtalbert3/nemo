import React from 'react'
import { Link } from 'react-router'

// About page, contains informaiton about NEMO project
class About extends React.Component {

  // Once page is mounted attach page title
  componentDidMount () {
    document.title = 'Nemo About'
  }

  // Render about page
  render () {
    return (
      <div className='container'>
        Information about NEMO project goes here.
      </div>

    )
  }
}

export default About
