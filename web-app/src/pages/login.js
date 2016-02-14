import React from 'react';
// import { Link } from 'react-router';

var feathers = require('feathers-client');
// var socketio = require('feathers-socketio/client');
var io = require('socket.io-client');

// var config = require('clientconfig');

var socket = io();
var app = feathers()
  .configure(feathers.socketio(socket));

var userService = app.service('user');

// Note to self find doesn't have a listener event
userService.on('created', function(user) {
  console.log('created ', user);
});

function validate(email, password) {

  socket.emit('user::find', {}, function(err, data) {
    console.log(err, data);
  });

  console.log(email, password);
}

export default React.createClass({
  componentDidMount: function() {
    document.title = 'Nemo Login';
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  handleSubmit: function(event) {
    event.preventDefault();

    const email = this.refs.email.value;
    const password = this.refs.password.value;

    validate(email, password);
    this.context.router.replace('/user');
  },

  render() {
    return (
      <div className='container-fluid col-md-4 col-md-offset-4'>
        <form className='form-signin' onSubmit={this.handleSubmit} autoComplete='on'>
          <h2 className='form-signin-heading'>Please Sign In</h2>
          <label htmlFor='inputEmail' className='sr-only'>Email Address</label>
          <input ref='email' type='email' classID='inputEmail' className='form-control' placeholder='Email Address' required='true'/>
          <label htmlFor='inputPassword' className='sr-only'>Email Address</label>
          <input ref='password' type='password' classID='inputPassword' className='form-control' placeholder='Password' required='true'/>
          <button className='btn btn-lg btn-primary btn-block' type='submit'>Sign In </button>
        </form>
      </div>
    );
  }
});
