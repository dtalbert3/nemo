import React from 'react';
import Bloodhound from 'bloodhound-js';

import { Input, ListGroup, ListGroupItem } from 'react-bootstrap';

const Suggestions = React.createClass({
  handleClick(index) {
    this.props.handleClick(index);
  },

  render() {
    var className = (this.props.hidden) ? 'hidden' : '';
    return (
      <ListGroup className={className}>
        {this.props.suggestions.map((suggestion, i) => {
          return (
            <ListGroupItem key={i} onClick={this.handleClick.bind(null, i)}>
              {suggestion}
            </ListGroupItem>
          );
        })}
      </ListGroup>
    );
  }
});

export default React.createClass({
  updateToken(token) {
    this.props.updateToken(token);
  },

  validationState() {
    var token = this.state.engine.get(this.state.input);
    if (token[0] !== undefined) {
      return 'success';
    } else if (this.state.input.length > 0) {
      return 'error';
    }
  },

  handleClick(index) {
    var token = this.state.suggestions[index];
    if (token !== undefined) {
      this.setState({
        suggestions: [],
        input: token[this.props.value],
        hidden: true
      });
      this.updateToken(token);
    }
  },

  handleKey(e) {
    if (e.key === 'Enter') {
      var token = this.state.suggestions[0];
      if (token !== undefined) {
        this.setState({
          suggestions: [],
          input: token[this.props.value],
          hidden: true
        });
        this.updateToken(token);
      }
    }
  },

  handleChange() {
    var input = this.refs.input.getValue();
    this.state.engine.search(input, (suggestions) => {
      this.setState({
        suggestions: suggestions,
        input: input,
        hidden: (suggestions.length === 0) ? true : false
      });
      var token = this.state.engine.get(input)[0];
      (token !== undefined) ?
        this.updateToken(token) :
        this.updateToken({});
    });
  },

  componentWillReceiveProps(nextProp) {
    this.state.engine.clear();
    this.state.engine.add(nextProp.suggestions);
  },

  getInitialState() {
    return {
      suggestions: [],
      input: '',
      hidden: true,
      engine: new Bloodhound({
        local: this.props.suggestions,
        identify: (d) => d[this.props.value],
        queryTokenizer: (data) => {
          return Bloodhound.tokenizers.whitespace(data);
        },
        datumTokenizer: (d) => {
          var tokens = [];
          var stringSize = d[this.props.value].length;
          for (var size = 1; size <= stringSize; size++) {
            for (var i = 0; i+size<= stringSize; i++) {
              tokens.push(d[this.props.value].substr(i, size));
            }
          }
          return tokens;
        }
      })
    };
  },

  render() {
    return (
      <div className='typeahead'>
        <Input type='text' ref='input'
          value={this.state.input}
          bsStyle={this.validationState()}
          hasFeedback
          onChange={this.handleChange}
          onKeyPress={this.handleKey}
        />
        <Suggestions
          suggestions={Array.from(this.state.suggestions, (d) => d[this.props.value])}
          handleClick={this.handleClick}
          hidden={this.state.hidden}
        />
      </div>
    );
  }
});
