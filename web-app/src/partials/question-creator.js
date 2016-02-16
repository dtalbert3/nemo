import React from 'react';

import { Label, Glyphicon } from 'react-bootstrap';

import TypeAhead from './typeahead';

import isEqual from 'lodash.isequal';

const Token = React.createClass({
  removeToken: function() {
    this.props.removeToken(this.props.token);
  },

  render() {
    return (
      <h4 className='token'>
        <Label className="label label-primary" >
          {this.props.token.value + ' '}
          <Glyphicon onClick={this.removeToken} glyph="remove" />
        </Label>
      </h4>
    );
  }
});

export default React.createClass({
  addToken(data) {
    var token = Object.assign({}, data);

    var exist = this.state.tokens.filter(function(d) {
      return isEqual(d, token);
    });

    if (exist.length === 0) {
      var tokens = this.state.tokens.concat(token);
      this.setState({
        tokens: tokens
      });
    }
  },

  removeToken(token) {
    var tokens = this.state.tokens.filter(function(d) {
      return (d !== token) ? true : false;
    });
    this.setState({
      tokens: tokens
    });
  },

  getInitialState() {
    var PARAMS = [
      {id: 1, value: 'double'},
      {id: 2, value: 'triple'},
      {id: 3, value: 'quadruple'}
    ];

    return {
      parameters: PARAMS,
      tokens: []
    };
  },

  render() {
    var self = this;
    return (
      <div className='container'>
        <TypeAhead
          parameters={this.state.parameters}
          addToken={this.addToken}
        />
        <div>
          {this.state.tokens.map(function(token, i) {
            return <Token key={i} token={token} removeToken={self.removeToken} />;
          })}
        </div>
      </div>
    );
  }
});
