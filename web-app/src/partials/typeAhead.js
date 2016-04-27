import React, { PropTypes } from 'react'
import { Input, ListGroup, ListGroupItem } from 'react-bootstrap'

/* It was opted to have the engine be passed as a prop so it can be
   easily swapped out and so that it can be externally maintained so a new
   engine doesn't get re-created each time the TypeAhead is initially rendered.
   TypeAhead requires some search engine that has the following methods
    - search(string, callback)
    - get(string)
   For this project 'bloodhound-js' is being used
*/

// Create TypeAhead which displays listing of suggestions based on given input
class TypeAhead extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      suggestions: [],
      input: '',
      hidden: true
    }

    this.handleToken = this.handleToken.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleKey = this.handleKey.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.validate = this.validate.bind(this)
    this.search = this.search.bind(this)
  }

  // Update token
  handleToken (token) {
    this.props.handleToken(token)
  }

  // Update input box to reflect clicked suggestion
  handleClick (index) {
    var token = this.state.suggestions[index]
    if (token !== undefined) {
      this.setState({
        suggestions: [],
        input: token[this.props.value],
        hidden: true
      })
      this.handleToken(token)
    }
  }

  // If enter is pressed input box updates to display first suggestion
  handleKey (e) {
    if (e.key === 'Enter') {
      var token = this.state.suggestions[0]
      if (token !== undefined) {
        this.setState({
          suggestions: [],
          input: token[this.props.value],
          hidden: true
        })
        this.handleToken(token)
      }
    }
  }

  // Update suggestion listing based on user input
  handleChange () {
    var input = this.refs.input.getValue()
    this.setState({
      input: input
    })
    this.search(input)
  }

  clearInput () {
    this.setState({
      input: ''
    })
  }

  // Check if input is valid for question creator
  validate () {
    var token = this.props.engine.get(this.state.input)
    if (token[0] !== undefined) {
      return 'success'
    } else if (this.state.input.length > 0) {
      return 'error'
    }
  }

  // Search for possible suggestions given input
  search (input) {
    this.props.engine.search(input, (suggestions) => {
      this.setState({
        suggestions: suggestions.slice(0, this.props.limit),
        hidden: (suggestions.length === 0)
      })
      var token = this.props.engine.get(input)[0]
      token !== undefined ?
        this.handleToken(token) :
        this.handleToken({})
    })
  }

  // Render TypeAhead
  render () {
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
          suggestions={Array.from(this.state.suggestions, this.props.displayValue)}
          handleClick={this.handleClick}
          hidden={this.state.hidden}
        />
      </div>
    )
  }
}

TypeAhead.propTypes = {
  suggestions: PropTypes.array,
  engine: PropTypes.any,
  key: PropTypes.string,
  value: PropTypes.string,
  displayValue: PropTypes.func,
  limit: PropTypes.number,
  handleToken: PropTypes.func
}

// Helper to display list of suggestions for TypeAhead
class Suggestions extends React.Component {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  // Pass to parent index of clicked suggestion
  handleClick (index) {
    this.props.handleClick(index)
  }

  // Render listing of suggestions
  render () {
    var className = ((this.props.hidden) ? 'hidden ' : '') + 'suggestions'
    var absolute = {position: 'absolute'}
    return (
      <ListGroup className={className} style={absolute} >
        {this.props.suggestions.map((suggestion, i) => {
          return (
            <ListGroupItem key={i} onClick={this.handleClick.bind(null, i)}>
              {suggestion}
            </ListGroupItem>
          )
        })}
      </ListGroup>
    )
  }
}

Suggestions.propTypes = {
  suggestions: PropTypes.array,
  handleClick: PropTypes.func,
  hidden: PropTypes.bool
}

export default TypeAhead
