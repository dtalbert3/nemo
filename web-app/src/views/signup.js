import React from 'react';
// import { Row, Col, Input, ButtonInput, Button } from 'react-bootstrap';

export default React.createClass({
  componentDidMount() {
    document.title = 'Nemo Login';
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  handleSubmit(event) {
    event.preventDefault();
    // Auth.createUser(this.refs.email.getValue(),
      // this.refs.password.getValue());
    // On success set alert than confirmation email was sent
  },

  validatePassword() {

  },

  validateConfirmPassword() {

  },

  validateEmail() {

  },

  render() {
    return (
      <Row>
        <Col sm={6} smOffset={3} md={6} mdOffset={3}>
          <form onSubmit={this.handleSubmit} autoComplete='on'>
            {/*
              Useful stuff for validation
              https://react-bootstrap.github.io/components.html#forms
              Get First/Last Name
              Get Email
              Get Password (validate with regex)
              Confirm Password (make sure it matches)
              Get affiliation

              On submit revalidate everything to make sure!
            */}
          </form>
        </Col>
      </Row>
    );
  }
});
