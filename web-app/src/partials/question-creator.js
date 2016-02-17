import React from 'react';

import { Input, Grid, Row, SplitButton, Button, MenuItem, Label, Glyphicon } from 'react-bootstrap';

import io from 'socket.io-client';
var socket = io();

import isEqual from 'lodash.isequal';
import TypeAhead from './typeahead';

const Token = React.createClass({
  removeToken() {
    this.props.removeToken(this.props.token);
  },

  render() {
    return (
      <h4 className='token'>
        <Label className="label label-primary" >
          {this.props.token[this.props.value] + ' '}
          <Glyphicon onClick={this.removeToken} glyph="remove" />
        </Label>
      </h4>
    );
  }
});

const QuestionDropdown = React.createClass({
  handleSelect(undefined, type) {
    this.props.handleSelect(type);
  },

  getTitle() {
    return (this.props.index !== null) ?
      this.props.items[this.props.index][this.props.name] :
      this.props.defaultTitle;
  },

  render() {
    return (
      <SplitButton
        title={this.getTitle()}
        id={'split-button-basic-' + this.props.id}
        onSelect={this.handleSelect}>

        {this.props.items.map((d, i) => {
          return <MenuItem key={i} eventKey={i}> {d[this.props.name]} </MenuItem>;
        })}

      </SplitButton>
    );
  }
});

const RangeInput = React.createClass({
  updateBounds() {
    var min = this.refs.min.getValue();
    var max = this.refs.max.getValue();
    this.setState({
      min: min,
      max: max
    });
    this.props.updateBounds({ min: min, max: max });
  },

  getInitialState() {
    return {
      min: '',
      max: ''
    };
  },

  render() {
    return (
      <div className='rangeInput'> between
        <Input type='number' ref='min'
          placeholder='Min'
          value={this.state.min}
          onChange={this.updateBounds} />
        and
        <Input type='number' ref='max'
          placeholder='Max'
          value={this.state.max}
          onChange={this.updateBounds} />
      </div>
    );
  }
});

export default React.createClass({
  addToken() {
    // Add error pop if with explanation if needed
    // Valid Token
    // Validate Bounds -> Valid numeric (ie no 3.5.1) and min < max
    var token = Object.assign({}, this.state.token);
    var exist = this.state.parameters.find((d) => isEqual(d, token));
    if (Object.keys(token).length && exist === undefined) {
      if (token.bounded) {
        if (this.state.parameterBounds.min < this.state.parameterBounds.max) {
          token.bounded1 = this.state.parameterBounds;
        } else {
          console.log('error'); // THROW?!
        }
      }

      this.setState({
        parameters: this.state.parameters.concat(token),
        parameterBounds: { min: null, max: null }
      });
    } else {
      console.log('error'); // Use throw?!? Requires addbutton to catch!
    }
  },

  updateToken(token) {
    this.setState({
      token: token
    });
  },

  removeToken(token) {
    this.setState({
      parameters: this.state.parameters.filter((d) => {
        return (d !== token) ? true : false;
      })
    });
  },

  handleSelectedType(index) {
    this.setState({
      selectedTypeIndex: index
    });
  },

  handleSelectedEvent(index) {
    this.setState({
      selectedEventIndex: index
    });
  },

  updateBounds(bounds) {
    this.setState({
      parameterBounds: bounds
    });
  },

  getInitialState() {
    socket.emit('questionParameters::find', {}, (err, data) => {
      if (!err) {
        this.setState({
          questionParameters: data.map((d) => d)
        });
      }
    });

    socket.emit('questionTypes::find', {}, (err, data) => {
      if (!err) {
        this.setState({
          questionTypes: data.map((d) => d)
        });
      }
    });

    socket.emit('questionEvents::find', {}, (err, data) => {
      if (!err) {
        this.setState({
          questionEvents: data.map((d) => d)
        });
      }
    });

    return {
      questionParameters: [],
      questionTypes: [],
      selectedTypeIndex: null,
      questionEvents: [],
      selectedEventIndex: null,
      parameterBounds: { min: null, max: null },
      parameters: [],
      token: {}
    };
  },

  render() {
    return (
      <Grid>
        <Row>
          <QuestionDropdown
            items={this.state.questionTypes}
            index={this.state.selectedTypeIndex}
            handleSelect={this.handleSelectedType}
            defaultTitle={'Question Type'}
            name={'Type'}
            id={1}/>

          <QuestionDropdown
            items={this.state.questionEvents}
            index={this.state.selectedEventIndex}
            handleSelect={this.handleSelectedEvent}
            defaultTitle={'Question Event'}
            name={'Name'}
            id={2}/>

          <span> for patients with </span>

          <TypeAhead
            suggestions={this.state.questionParameters}
            key='ID'
            value='Name'
            updateToken={this.updateToken}
          />

          { (Object.keys(this.state.token).length && this.state.token.bounded) ?
            <RangeInput
              bounds={this.state.parameterBounds}
              updateBounds={this.updateBounds}/> :
            undefined
          }

          <Button onClick={this.addToken}>Add</Button>
        </Row>

        <Row>
          {this.state.parameters.map((token, i) => {
            return <Token
              key={i}
              value={'Name'}
              token={token}
              removeToken={this.removeToken} />;
          })}
        </Row>
      </Grid>
    );
  }
});
