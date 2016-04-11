import React from 'react';
import { Input, ListGroup, ListGroupItem } from 'react-bootstrap';
import Bloodhound from 'bloodhound-js';

// Helper to display list of suggestions for TypeAhead
const Suggestions = React.createClass({

  // Pass to parent index of clicked suggestion
  handleClick(index) {
    this.props.handleClick(index);
  },

  // Render listing of suggestions
  render() {
    var className = ((this.props.hidden) ? 'hidden ' : '') + 'suggestions';
    var absolute = {position: 'absolute'};
    return (
      <ListGroup className={className} style={absolute} >
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

// Create TypeAhead which displays listing of suggestions based on given input
export default React.createClass({

  // Update token
  handleToken(token) {
    this.props.handleToken(token);
  },

  // Update input box to reflect clicked suggestion
  handleClick(index) {
    var token = this.state.suggestions[index];
    if (token !== undefined) {
      this.setState({
        suggestions: [],
        input: token[this.props.value],
        hidden: true
      });
      this.handleToken(token);
    }
  },

  // If enter is pressed input box updates to display first suggestion
  handleKey(e) {
    if (e.key === 'Enter') {
      var token = this.state.suggestions[0];
      if (token !== undefined) {
        this.setState({
          suggestions: [],
          input: token[this.props.value],
          hidden: true
        });
        this.handleToken(token);
      }
    }
  },

  // Update suggestion listing based on user input
  handleChange() {
    var input = this.refs.input.getValue();
    this.setState({
      input: input
    });
    this.search(input);
  },

  // Check if input is valid for question creator
  validate() {
    var token = this.state.engine.get(this.state.input);
    if (token[0] !== undefined) {
      return 'success';
    } else if (this.state.input.length > 0) {
      return 'error';
    }
  },

  // Search for possible suggestions given input
  search(input) {
    this.state.engine.search(input, (suggestions) => {
      this.setState({
        suggestions: suggestions.slice(0, this.props.limit),
        hidden: (suggestions.length === 0) ? true : false
      });
      var token = this.state.engine.get(input)[0];
      (token !== undefined) ?
        this.handleToken(token) :
        this.handleToken({});
    });
  },

  updateSuggestions() {
    this.state.engine.clear();
    this.state.engine.add(this.props.suggestions);
    this.search(this.state.input);
  },

  // Initialize TypeAhead and search engine
  getInitialState() {
    return {
      suggestions: this.props.suggestions,
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
            for (var i = 0; i + size <= stringSize; i++) {
              tokens.push(d[this.props.value].substr(i, size));
            }
          }
          return tokens;
        }
      })
    };
  },

  // Render TypeAhead
  render() {
    return (
      <div className='typeahead'>
        {/* TypeAhead input box */}
        <Input type='text' ref='input'
          value={this.state.input}
          bsStyle={this.validate()}
          hasFeedback
          onChange={this.handleChange}
          onKeyPress={this.handleKey}
        />
        {/* Suggestion listing */}
        <Suggestions
          suggestions={Array.from(this.state.suggestions, (d) => d[this.props.value])}
          handleClick={this.handleClick}
          hidden={this.state.hidden}
        />
      </div>
    );
  }
});