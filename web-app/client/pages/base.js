'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'base',

  componentDidMount: function componentDidMount() {
    document.title = 'Nemo';
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'nav',
        { className: 'navbar navbar-default' },
        _react2.default.createElement(
          'div',
          { className: 'container-fluid' },
          _react2.default.createElement(
            'div',
            { className: 'navbar-header' },
            _react2.default.createElement(
              _reactRouter.Link,
              { to: '/', className: 'navbar-brand' },
              'Nemo'
            )
          ),
          _react2.default.createElement(
            'ul',
            { className: 'nav navbar-nav' },
            _react2.default.createElement(
              'li',
              null,
              _react2.default.createElement(
                _reactRouter.Link,
                { to: '/login' },
                'User'
              )
            )
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'container-fluid' },
        this.props.children
      )
    );
  }
});