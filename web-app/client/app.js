'use strict';

var _domready = require('domready');

var _domready2 = _interopRequireDefault(_domready);

var _faviconSetter = require('favicon-setter');

var _faviconSetter2 = _interopRequireDefault(_faviconSetter);

var _reactDom = require('react-dom');

var _router = require('./router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Start once dom has loaded
(0, _domready2.default)(function () {

  // Create app container
  var app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);

  // Set fav icon
  (0, _faviconSetter2.default)('/favicon.png');

  // Render app
  (0, _reactDom.render)(_router.router, document.getElementById('app'));
});
// import config from 'clientconfig';