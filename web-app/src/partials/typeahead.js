import React from 'react';
import Bloodhound from 'bloodhound-js';

import { Input, ListGroup, ListGroupItem } from 'react-bootstrap';

const Suggestions = React.createClass({
  handleClick(value) {
    this.props.handleClick(value);
  },

  render() {
    var className = (this.props.hidden) ? 'hidden' : '';
    return (
      <ListGroup className={className}>
        {this.props.suggestions.map((suggestion, i) => {
          return (
            <ListGroupItem key={i} onClick={this.handleClick.bind(null, suggestion)}>
              {suggestion}
            </ListGroupItem>
          );
        })}
      </ListGroup>
    );
  }
});

export default React.createClass({
  addToken(data) {
    this.props.addToken(data);
  },

  validationState() {
    var input = this.state.value;
    var token = this.state.engine.get(input);
    if (token[0] !== undefined) {
      return 'success';
    } else if (input.length > 0) {
      return 'error';
    }
  },

  handleClick(value) {
    var token = this.state.engine.get(value);
    if (token[0] !== undefined) {
      this.setState({
        suggestions: [],
        value: value,
        hidden: true
      });
      this.addToken(token[0]);
    }
  },

  handleKey(e) {
    if (e.key === 'Enter') {
      var token = this.state.engine.get(this.refs.input.getValue());
      if (token[0] === undefined && this.state.suggestions.length > 0) {
        this.setState({
          value: this.state.suggestions[0].value,
          hidden: true
        });
      } else if (token[0] !== undefined) {
        this.addToken(token[0]);
      }
    }
  },

  handleChange() {
    var input = this.refs.input.getValue();
    this.state.engine.search(input, (suggestions) => {
      this.setState({
        suggestions: suggestions,
        value: input,
        hidden: (suggestions.length === 0) ? true : false
      });
    });
  },

  componentWillReceiveProps(nextProp) {
    this.state.engine.clear();
    this.state.engine.add(nextProp.parameters);
  },

  getInitialState() {
    return {
      suggestions: [],
      value: '',
      hidden: true,
      engine: new Bloodhound({
        local: this.props.parameters,
        identify: (d) => d.value,
        queryTokenizer: (data) => {
          return Bloodhound.tokenizers.whitespace(data);
        },
        datumTokenizer: (d) => {
          var tokens = [];
          var stringSize = d.value.length;
          for (var size = 1; size <= stringSize; size++) {
            for (var i = 0; i+size<= stringSize; i++) {
              tokens.push(d.value.substr(i, size));
            }
          }
          return tokens;
        }
      })
    };
  },

  render() {
    return (
      <div>
        <Input type='text' ref='input'
          value={this.state.value}
          bsStyle={this.validationState()}
          hasFeedback
          onChange={this.handleChange}
          onKeyPress={this.handleKey}
        />
        <Suggestions
          suggestions={Array.from(this.state.suggestions, (d) => d.value)}
          handleClick={this.handleClick}
          hidden={this.state.hidden}
        />
      </div>
    );
  }
});
