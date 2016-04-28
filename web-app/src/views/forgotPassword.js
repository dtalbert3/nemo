import React from 'react'
import { Row, Col, Input, ButtonInput, Tooltip, OverlayTrigger } from 'react-bootstrap'

import Alert from '../partials/alert'
import validator from 'validator'

import api from '../api'

class ForgotPassword extends React.Component {
  constructor (props, context) {
    super(props)

    context.router

    this.state = {
      email: '',
      password: '',
      confirmPassword: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.validatePassword = this.validatePassword.bind(this)
    this.validateConfirmPassword = this.validateConfirmPassword.bind(this)
    this.validateEmail = this.validateEmail.bind(this)
    this.inputStatus = this.inputStatus.bind(this)
  }

  // Handles validation and makes call to api to create a new user
  handleSubmit (event) {
    event.preventDefault()

    if (!this.validateEmail()) {
      Alert('Enter a valid email', 'danger', 4 * 1000)
      return
    }

    if (!this.validatePassword()) {
      Alert('Enter a valid password', 'danger', 4 * 1000)
      return
    }

    if (!this.validateConfirmPassword()) {
      Alert('Passwords do not match', 'danger', 4 * 1000)
      return
    }

    var userData = {
      firstName: this.refs.firstName.getValue(),
      lastName: this.refs.lastName.getValue(),
      affiliation: this.refs.affiliation.getValue(),
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword
    }

    api.signup(userData)
      .then((msg) => {
        Alert(msg, 'success', 4 * 1000)
      })
      .catch((err) => {
        Alert(err, 'danger', 4 * 1000)
      })
  }

  // Handle user input to set state
  // This is done so that validation happens while user types
  handleChange () {
    this.setState({
      email: this.refs.email.getValue(),
      password: this.refs.password.getValue(),
      confirmPassword: this.refs.confirmPassword.getValue()
    })
  }

  // Helper to validate user password
  validatePassword () {
    var password = this.state.password
    var valid = false
    if (validator.matches(password, /\d/) &&
      validator.matches(password, /[a-z]/) &&
      validator.matches(password, /[A-Z]/) &&
      password.length >= 6) {
      valid = true
    }
    return valid
  }

  // Helper to confirm user passwords match
  validateConfirmPassword () {
    return this.validatePassword() && (this.state.password === this.state.confirmPassword)
  }

  // Helper to validate user email
  validateEmail () {
    return validator.isEmail(this.state.email)
  }

  // Helper to
  inputStatus (valid) {
    if (valid) {
      return 'success'
    } else {
      return 'error'
    }
  }

  componentDidMount () {
    document.title = 'Nemo Forgot Password'
  }

  render () {

    // Tooltip to display what passwords are allowed
    const passwordTooltip = (
      <Tooltip id='passwordTip'>Password must contain one number, one uppercase letter, one lowercase letter, and be at least 6 characters!</Tooltip>
    )

    return (
      <Row>
        <Col sm={6} smOffset={3} md={6} mdOffset={3}>
          <br/>
          <form onSubmit={this.handleSubmit} autoComplete='on'>
            <Input ref='email' type='email' hasFeedback
              label='Email Address' value={this.state.email} onChange={this.handleChange}
              required bsStyle={this.inputStatus(this.validateEmail())} />
            <OverlayTrigger overlay={passwordTooltip} trigger='focus'>
              <Input ref='password' type='password' hasFeedback
                label='Password' value={this.state.password} onChange={this.handleChange}
                required bsStyle={this.inputStatus(this.validatePassword())} />
            </OverlayTrigger>
            <Input ref='confirmPassword' type='password' hasFeedback
              label='Confirm Password' value={this.state.confirmPassword} onChange={this.handleChange}
              required bsStyle={this.inputStatus(this.validateConfirmPassword())} />
            <ButtonInput type='submit' value='Update Password' bsStyle='primary' block/>
          </form>
        </Col>
      </Row>
    )
  }
}

ForgotPassword.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default ForgotPassword
