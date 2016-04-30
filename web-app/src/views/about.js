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
        <br/>
        The Never-Ending Medical Learner (NEMO) is being developed for the Kansas University Medical Center as a tool for machine learning research. The primary purpose of the system is to aid domain experts in developing predictions relating to patients. The system uses machine learning techniques in order to make conclusions and predictions from prior data. NEMO operates by taking questions from domain experts and creating learning algorithms to generate predictions. NEMO makes use of a feedback mechanism, where domain experts relay their opinions on the system's accuracy and predictions, and NEMO utilizes this to create better predictions.
      </div>
    )
  }
}

export default About
