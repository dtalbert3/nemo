import React from 'react';
import { Row, Col, Input, ButtonInput } from 'react-bootstrap';
import { Link } from 'react-router';
import Alert from '../partials/alert';
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
        Alert('Invalid email/password', 'danger', 4 * 1000);
      }
    });
  },

  render() {
    return (
      <Row>
        <Col sm={4} smOffset={4} md={4} mdOffset={4}>
          <form onSubmit={this.handleSubmit} autoComplete='on'>
            <h2 >Please Login</h2>
            <Input ref='email' type='email' label='Email Address' placeholder='Enter email' required={true} />
            <Input ref='password' type='password' label='Password' placeholder='Enter password' required={true} />
            <ButtonInput type='submit' value='Login' bsStyle='primary' block/>
          </form>
          <Row>
            <Col sm={6} md={6}>
              <Link to='/forgotPassword'> forgot password? </Link>
            </Col>
            <Col sm={6} md={6}>
              <span>
              <Link to='/signup' style={{float: 'right'}}> signup </Link>
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
});
