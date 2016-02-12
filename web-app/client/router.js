'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _base = require('./pages/base');

var _base2 = _interopRequireDefault(_base);

var _login = require('./pages/login');

var _login2 = _interopRequireDefault(_login);

var _userDashboard = require('./pages/user-dashboard');

var _userDashboard2 = _interopRequireDefault(_userDashboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = _react2.default.createElement(
  _reactRouter.Route,
  { path: '/', component: _base2.default },
  _react2.default.createElement(_reactRouter.Route, { path: '/login', component: _login2.default }),
  _react2.default.createElement(_reactRouter.Route, { path: '/user', component: _userDashboard2.default })
);

var router = exports.router = _react2.default.createElement(_reactRouter.Router, { routes: routes, history: _reactRouter.browserHistory });