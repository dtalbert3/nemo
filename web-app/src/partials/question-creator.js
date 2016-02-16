import React from 'react';

import { Label, Glyphicon } from 'react-bootstrap';

import io from 'socket.io-client';

var socket = io();

import TypeAhead from './typeahead';

import isEqual from 'lodash.isequal';

const Token = React.createClass({
  removeToken() {
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

    var exist = this.state.tokens.filter((d) => {
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
    var tokens = this.state.tokens.filter((d) => {
      return (d !== token) ? true : false;
    });
    this.setState({
      tokens: tokens
    });
  },

  getInitialState() {
    socket.emit('questionService::find', {}, (err, data) => {
      if (!err) {
        this.setState({
          parameters: data.map((d) => d)
        });
      }
    });

    return {
      parameters: [],
      tokens: []
    };
  },

  render() {
    return (
      <div className='container'>
        <TypeAhead
          parameters={this.state.parameters.map((d) => {
            return { value: d.concept_cd, id: d.ID };
          })}
          addToken={this.addToken}
        />
        <div>
          {this.state.tokens.map((token, i) => {
            return <Token key={i} token={token} removeToken={this.removeToken} />;
          })}
        </div>
      </div>
    );
  }
});
