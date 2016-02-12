'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { Link } from 'react-router';

var feathers = require('feathers-client');
// var socketio = require('feathers-socketio/client');
var io = require('socket.io-client');

// var config = require('clientconfig');

var socket = io();
var app = feathers().configure(feathers.socketio(socket));

var userService = app.service('user');

// Note to self find doesn't have a listener event
userService.on('created', function (user) {
  console.log('created ', user);
});

function validate(email, password) {

  socket.emit('user::find', {}, function (err, data) {
    console.log(err, data);
  });

  console.log(email, password);
}

exports.default = _react2.default.createClass({
  displayName: 'login',

  componentDidMount: function componentDidMount() {
    document.title = 'Nemo Login';
  },
  contextTypes: {
    router: _react2.default.PropTypes.object.isRequired
  },
  handleSubmit: function handleSubmit(event) {
    event.preventDefault();

    var email = this.refs.email.value;
    var password = this.refs.password.value;

    validate(email, password);
    this.context.router.replace('/user');
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: 'container-fluid col-md-4 col-md-offset-4' },
      _react2.default.createElement(
        'form',
        { className: 'form-signin', onSubmit: this.handleSubmit, autoComplete: 'on' },
        _react2.default.createElement(
          'h2',
          { className: 'form-signin-heading' },
          'Please Sign In'
        ),
        _react2.default.createElement(
          'label',
          { htmlFor: 'inputEmail', className: 'sr-only' },
          'Email Address'
        ),
        _react2.default.createElement('input', { ref: 'email', type: 'email', classID: 'inputEmail', className: 'form-control', placeholder: 'Email Address', required: 'true' }),
        _react2.default.createElement(
          'label',
          { htmlFor: 'inputPassword', className: 'sr-only' },
          'Email Address'
        ),
        _react2.default.createElement('input', { ref: 'password', type: 'password', classID: 'inputPassword', className: 'form-control', placeholder: 'Password', required: 'true' }),
        _react2.default.createElement(
          'button',
          { className: 'btn btn-lg btn-primary btn-block', type: 'submit' },
          'Sign In '
        )
      )
    );
  }
});