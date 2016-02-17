import React from 'react';
import { Input, Grid, Row, SplitButton, Button, MenuItem, Label, Glyphicon } from 'react-bootstrap';
import TypeAhead from './typeahead';
import Alert from './alert';
import isEqual from 'lodash.isequal';
// import config from 'clientconfig';
import io from 'socket.io-client';
// const socket = io(config.apiUrl); // Required for production
const socket = io(); // Defaults to localhost

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
    min = (min !== '') ? parseInt(min) : null;
    max = (max !== '') ? parseInt(max) : null;
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
  addParameter() {
    // Add error pop if with explanation if needed
    // Valid Parameter
    // Validate Bounds -> Valid numeric (ie no 3.5.1) and min < max
    // BUG doesn't realize duplicate eixst all the time...
    var parameter = Object.assign({}, this.state.parameter);
    var duplicate = this.state.parameters.find((d) => isEqual(d.bounded1, parameter.bounded1));
    if (parameter.bounded) {
      var bounds = Object.assign({}, this.state.parameterBounds);
      if (bounds.min === null || bounds.max === null) {
        Alert('Missing Range', 'danger', 4 * 1000);
        return;
      } else if (bounds.min > bounds.max) {
        Alert('Invalid Parameter Range', 'danger', 4 * 1000);
        return;
      } else {
        parameter.bounded1 = bounds;
      }
    } else if (Object.keys(parameter).length < 1) {
      Alert('Invalid Parameter', 'danger', 4 * 1000);
      return;
    } else if (duplicate !== undefined || duplicate.bounded1.min === parameter.bounded1.min) {
      Alert('Parameter Already Exist', 'danger', 4 * 1000);
      return;
    } else if (this.state.parameters.length > 0) {
      console.log(duplicate.bound1.min, parameter.bounded1.min);
    }

    this.setState({
      parameters: this.state.parameters.concat(parameter)
    });
    return;
  },

  updateParameter(parameter) {
    this.setState({
      parameter: parameter
    });
  },

  removeParameter(parameter) {
    this.setState({
      parameters: this.state.parameters.filter((d) => {
        return (d !== parameter) ? true : false;
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

  componentDidMount() {
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
  },

  getInitialState() {
    return {
      questionTypes: [],
      selectedTypeIndex: null,
      questionEvents: [],
      selectedEventIndex: null,
      parameterBounds: { min: null, max: null },
      parameters: [],
      parameter: {}
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
            suggestions={[]}
            key='ID'
            value='Name'
            limit={10}
            updateToken={this.updateParameter}
          />

          { (Object.keys(this.state.parameter).length && this.state.parameter.bounded) ?
            <RangeInput
              bounds={this.state.parameterBounds}
              updateBounds={this.updateBounds}/> :
            undefined
          }

          <Button onClick={this.addParameter}>Add</Button>
        </Row>

        <Row>
          {this.state.parameters.map((parameter, i) => {
            return <Token
              key={i}
              value={'Name'}
              token={parameter}
              removeToken={this.removeParameter} />;
          })}
        </Row>
      </Grid>
    );
  }
});
