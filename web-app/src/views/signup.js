import React from 'react';
import { Row, Col, Input, ButtonInput, Tooltip, OverlayTrigger } from 'react-bootstrap';

import Alert from '../partials/alert';
import validator from 'validator';

import api from '../api';

export default React.createClass({
  componentDidMount() {
    document.title = 'Nemo Signup';
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  handleSubmit(event) {
    event.preventDefault();

    if (!this.validateEmail()) {
      Alert('Enter a valid email', 'danger', 4 * 1000);
      return;
    }

    if (!this.validatePassword()) {
      Alert('Enter a valid password', 'danger', 4 * 1000);
      return;
    }

    if (!this.validateConfirmPassword()) {
      Alert('Passwords do not match', 'danger', 4 * 1000);
      return;
    }

    var userData = {
      firstName: this.refs.firstName.getValue(),
      lastName: this.refs.lastName.getValue(),
      affiliation: this.refs.affiliation.getValue(),
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword
    };

    api.signup(userData)
      .then((msg) => {
        Alert(msg, 'success', 4 * 1000);
      })
      .catch((err) => {
        Alert(err, 'danger', 4 * 1000);
      });
  },

  handleChange() {
    this.setState({
      email: this.refs.email.getValue(),
      password: this.refs.password.getValue(),
      confirmPassword: this.refs.confirmPassword.getValue()
    });
  },

  validatePassword() {
    var password = this.state.password;
    var valid = false;
    if (validator.matches(password, /\d/) &&
      validator.matches(password, /[a-z]/) &&
      validator.matches(password, /[A-Z]/) &&
      password.length >= 6) {
      valid = true;
    }
    return valid;
  },

  validateConfirmPassword() {
    return this.validatePassword() && (this.state.password === this.state.confirmPassword);
  },

  validateEmail() {
    return validator.isEmail(this.state.email);
  },

  inputStatus(valid) {
    if (valid) {
      return 'success';
    } else {
      return 'error';
    }
  },

  getInitialState() {
    return {
      email: '',
      password: '',
      confirmPassword: ''
    }
  },

  render() {
    const emailTooltip = (
      <Tooltip> .edu emails will recieve higher privileges!</Tooltip>
    );

    const passwordTooltip = (
      <Tooltip>Password must contain one number, one uppercase letter, one lowercase letter, and be at least 6 characters!</Tooltip>
    );

    return (
      <Row>
        <Col sm={6} smOffset={3} md={6} mdOffset={3}>
          <form onSubmit={this.handleSubmit} autoComplete='on'>
            <Input ref='firstName' type='text'
              label='First Name' placeholder='Enter email'
              required={true} />
            <Input ref='lastName' type='text'
              label='Last Name' placeholder='Enter password'
              required={true} />
            <Input ref='affiliation' type='text'
              label='Affiliation' placeholder='Enter affiliation' />
            <OverlayTrigger overlay={emailTooltip} trigger='focus'>
              <Input ref='email' type='email' hasFeedback
                label='Email Address' value={this.state.email} onChange={this.handleChange}
                required={true} bsStyle={this.inputStatus(this.validateEmail())} />
            </OverlayTrigger>
            <OverlayTrigger overlay={passwordTooltip} trigger='focus'>
              <Input ref='password' type='password' hasFeedback
                label='Password' value={this.state.password} onChange={this.handleChange}
                required={true} bsStyle={this.inputStatus(this.validatePassword())} />
            </OverlayTrigger>
            <Input ref='confirmPassword' type='password' hasFeedback
              label='Confirm Password' value={this.state.confirmPassword} onChange={this.handleChange}
              required={true} bsStyle={this.inputStatus(this.validateConfirmPassword())} />
            <ButtonInput type='submit' value='Signup' bsStyle='primary' block/>
          </form>
        </Col>
      </Row>
    );
  }
});
