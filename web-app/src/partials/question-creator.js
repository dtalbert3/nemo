import React from 'react';
import { Input, Grid, Row, SplitButton, ButtonGroup, Button, MenuItem, Label, Glyphicon } from 'react-bootstrap';
import TypeAhead from './typeahead';
import Alert from './alert';
import isEqual from 'lodash.isequal';
import config from 'clientconfig';
import io from 'socket.io-client';
const qstn = io.connect(config.apiUrl + '/qstn');

// Creates token to display information about added parameters
const Token = React.createClass({

  // Handle removal of token when clicked
  removeToken() {
    this.props.removeToken(this.props.token);
  },

  // Render token
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

// Helper to render dropdowns for Question Type/Event
const QuestionDropdown = React.createClass({

  // Handle dropdown selection to update Question Type/Event
  handleSelect(undefined, type) {
    this.props.handleSelect(type);
  },

  // Set display tile to selected Question Type/Event
  getTitle() {
    return (this.props.index !== null) ?
      this.props.items[this.props.index][this.props.name] :
      this.props.defaultTitle;
  },

  // Render dropdown menu
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

// Create range input for questions that require upper/lower bounds
const RangeInput = React.createClass({

  // Update parent component with bounds
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

  // Initialize bounds
  getInitialState() {
    return {
      min: '',
      max: ''
    };
  },

  // Render input for getting question bounds
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

// Creates a form that allows users to form a question for the data mart
export default React.createClass({

  // Submit question formed by user
  submitQuestion() {

    // Validate to ensure all parameters have been bound
    // Alert pops up if invalid input was given
    if (this.state.parameters.length < 1) {
      Alert('No Parameters Added', 'danger', 4 * 1000);
      return;
    } else if (this.state.selectedTypeIndex === null) {
      Alert('Missing Question Type', 'danger', 4 * 1000);
      return;
    } else if (this.state.selectedEventIndex === null) {
      Alert('Missing Question Event', 'danger', 4 * 1000);
      return;
    } else {

      // If valid bind type/event/parameters to data
      var data = {
        UserID: 1, // Currently testing with hard-coded UserID
        QuestionStatusID: 1,
        QuestionTypeID: this.state.questionTypes[this.state.selectedTypeIndex].ID,
        QuestionEventID: this.state.questionEvents[this.state.selectedEventIndex].ID,
        QuestionParamsArray: this.state.parameters
      };

      // Send question to database
      qstn.emit('create', data, (err) => {
        if (!err) {
          Alert('Question Submitted!', 'success', 4 * 1000);
        } else {
          Alert('Error Submitting Question!', 'danger', 4 * 1000);
        }
      });
    }
  },

  // Clear all form fields and tokens
  clearQuestion() {
    this.setState({
      selectedTypeIndex: null,
      selectedEventIndex: null,
      bounds: { min: null, max: null },
      parameters: [],
      parameter: {}
    });
  },

  // Add parameter created via typeahead and range (if required)
  addParameter() {

    // Create parameter to break reference
    var parameter = Object.assign({}, this.state.parameter);

    // Find if duplicate of parameter exist
    var duplicate = this.state.parameters.find((d) => isEqual(d.bounded1, parameter.bounded1));

    // Validate parameter
    if (parameter.bounded) {
      var bounds = Object.assign({}, this.state.bounds);
      if (bounds.min === null || bounds.max === null) {
        Alert('Missing Range', 'danger', 4 * 1000);
        return;
      } else if (bounds.min > bounds.max) {
        Alert('Invalid Parameter Range', 'danger', 4 * 1000);
        return;
      }
    } else if (Object.keys(parameter).length < 1) {
      Alert('Invalid Parameter', 'danger', 4 * 1000);
      return;
    } else if (duplicate !== undefined) {
      Alert('Parameter Already Exist', 'danger', 4 * 1000);
      return;
    } else if (this.state.parameters.length > 0) {
      console.log(duplicate.bound1.min, parameter.bounded1.min);
    }

    // Rebind parameter
    parameter.TypeID = parameter.ID;
    parameter.tval_char = 'null';

    // Create upper bounded parameter for database during submission
    if (parameter.bounded) {
      parameter.nval_num = this.state.bounds.min;
      parameter.upper_bound = 0;

      var parameterUpper = Object.assign({}, parameter);
      parameterUpper.nval_num = this.state.bounds.max;
      parameter.upper_bound = 1;
    }

    // Update state of parameters listing
    this.setState({
      parameters: (!parameter.bounded) ?
        this.state.parameters.concat(parameter) :
        this.state.parameters.concat(parameter).concat(parameterUpper)
    });
  },

  // Handle updating of parameter from TypeAhead
  updateParameter(parameter) {
    this.setState({
      parameter: parameter
    });
  },

  // Handle removal of parameter once Token clicked
  removeParameter(parameter) {
    this.setState({
      parameters: this.state.parameters.filter((d) => {
        return (d !== parameter) ? true : false;
      })
    });
  },

  // Handle updating of selected question type
  handleSelectedType(index) {
    this.setState({
      selectedTypeIndex: index
    });
  },

  // Handle updating of selected question event
  handleSelectedEvent(index) {
    this.setState({
      selectedEventIndex: index
    });
  },

  // Handle updating of question bounds
  updateBounds(bounds) {
    this.setState({
      bounds: bounds
    });
  },

  // Once form is mounted update possible parameters and question types/events
  componentDidMount() {
    qstn.emit('getTypes', {}, (err, data) => {
      if (!err) {
        this.setState({
          questionTypes: data.map((d) => d)
        });
      } else {
        Alert('Error Fetching Question Types', 'danger', 4 * 1000);
      }
    });

    qstn.emit('getEvents', {}, (err, data) => {
      if (!err) {
        this.setState({
          questionEvents: data.map((d) => d)
        });
      } else {
        Alert('Error Fetching Question Events', 'danger', 4 * 1000);
      }
    });
  },

  // Initialize question creator form
  getInitialState() {
    return {
      questionTypes: [],
      selectedTypeIndex: null,
      questionEvents: [],
      selectedEventIndex: null,
      bounds: { min: null, max: null },
      parameters: [],
      parameter: {}
    };
  },

  // Render question creator form
  render() {
    return (
      <Grid>
        <Row>
          {/* Question Type Dropdown */}
          <QuestionDropdown
            items={this.state.questionTypes}
            index={this.state.selectedTypeIndex}
            handleSelect={this.handleSelectedType}
            defaultTitle={'Question Type'}
            name={'Type'}
            id={1}/>

          {/* Question Event Dropdown */}
          <QuestionDropdown
            items={this.state.questionEvents}
            index={this.state.selectedEventIndex}
            handleSelect={this.handleSelectedEvent}
            defaultTitle={'Question Event'}
            name={'Name'}
            id={2}/>

          <span> for patients with </span>

          {/* TypeAhead for finding parameters */}
          <TypeAhead
            suggestions={[]}
            key='ID'
            value='Name'
            limit={10}
            updateToken={this.updateParameter}
          />

          {/* Create range input if required by parameter  */}
          { (Object.keys(this.state.parameter).length && this.state.parameter.bounded) ?
            <RangeInput
              bounds={this.state.bounds}
              updateBounds={this.updateBounds}/> :
            undefined
          }

          <Button onClick={this.addParameter}>Add</Button>
        </Row>
        <Row>
          {/* Render parameters as tokens */}
          {this.state.parameters.map((parameter, i) => {
            return <Token
              key={i}
              value={'Name'}
              token={parameter}
              removeToken={this.removeParameter} />;
          })}
        </Row>

        <Row>
          {/* Create buttons for submitting/clearing question*/}
          <ButtonGroup>
            <Button onClick={this.submitQuestion}>Submit</Button>
            <Button onClick={this.clearQuestion}>Clear</Button>
          </ButtonGroup>
        </Row>
      </Grid>
    );
  }
});
