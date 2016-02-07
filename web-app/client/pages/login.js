var PageView = require('./base');
var templates = require('../templates');

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

socket.emit('user::find', {}, function(err, data) {
  console.log(err, data);
});

module.exports = PageView.extend({
  pageTitle: 'Login',
  template: templates.pages.login
});
