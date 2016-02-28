import React from 'react';
import { Col, Input, ButtonInput, Button } from 'react-bootstrap';
import Auth from '../auth';

export default React.createClass({
  componentDidMount() {
    document.title = 'Nemo Login';
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  handleSubmit(event) {
    event.preventDefault();

    var email = this.refs.email.getValue();
    var password = this.refs.password.getValue();
    Auth.login(email, password, (valid) => {
      if (valid) {
        this.context.router.replace('/user');
      } else {
        // Set error state for form
        // Create alert!
      }
    });
  },

  createUser() {
    Auth.createUser(this.refs.email.getValue(),
      this.refs.password.getValue());
  },

  render() {
    return (
      <Col md={4} mdOffset={4}>
        <form className='form-signin' onSubmit={this.handleSubmit} autoComplete='on'>
          <h2 className='form-signin-heading'>Please sign in</h2>
          <Input ref='email' type='email' label='Email Address' placeholder='Enter email' required={true} />
          <Input ref='password' type='password' label='Password' placeholder='Enter password' required={true} />
          <ButtonInput type='submit' value='Sign In' bsStyle='primary' block/>
          <Button bsStyle='warning' block onClick={this.createUser}>Create User</Button>
        </form>
      </Col>
    );
  }
});
