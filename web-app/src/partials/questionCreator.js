import React, { PropTypes } from 'react'
import { Input, Grid, Row, SplitButton, ButtonGroup, Button, MenuItem, Label, Glyphicon, Col } from 'react-bootstrap'
import TypeAhead from './typeAhead'
import Alert from './alert'
import isEqual from 'lodash.isequal'

// Creates a form that allows users to form a question for the data mart
class QuestionCreator extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedTypeIndex: null,
      selectedEventIndex: null,
      selectedDemographicIndex: null,
      selectedDemographicValueIndex: null,
      bounds: { min: null, max: null },
      parameters: [],
      parameter: {}
    }

    this.submitQuestion = this.submitQuestion.bind(this)
    this.clearQuestion = this.clearQuestion.bind(this)
    this.addParameter = this.addParameter.bind(this)
    this.updateParameter = this.updateParameter.bind(this)
    this.removeParameter = this.removeParameter.bind(this)
    this.handleSelectedType = this.handleSelectedType.bind(this)
    this.handleSelectedEvent = this.handleSelectedEvent.bind(this)
    this.handleSelectedDemographic = this.handleSelectedDemographic.bind(this)
    this.handleSelectedDemographicValue = this.handleSelectedDemographicValue.bind(this)
    this.updateBounds = this.updateBounds.bind(this)
  }

  // Submit question formed by user
  submitQuestion () {

    // Validate to ensure all parameters have been bound
    // Alert pops up if invalid input was given
    if (this.state.parameters.length < 1) {
      Alert('No Parameters Added', 'danger', 4 * 1000)
      return
    } else if (this.state.selectedTypeIndex === null) {
      Alert('Missing Question Type', 'danger', 4 * 1000)
      return
    } else if (this.state.selectedEventIndex === null) {
      Alert('Missing Question Event', 'danger', 4 * 1000)
      return
    } else {

      // If valid bind type/event/parameters to data
      var data = {
        UserID: parseInt(localStorage.userID), // Currently testing with hard-coded UserID
        QuestionStatusID: 1,
        QuestionTypeID: this.props.questionTypes[this.state.selectedTypeIndex].ID,
        QuestionEventID: this.props.questionEvents[this.state.selectedEventIndex].ID,
        QuestionParamsArray: this.state.parameters
      }

      // Send question to database
      this.props.handleSubmit(data)
    }
  }

  // Clear all form fields and tokens
  clearQuestion () {
    this.setState({
      selectedTypeIndex: null,
      selectedEventIndex: null,
      selectedDemographicIndex: null,
      selectedDemographicValueIndex: null,
      bounds: { min: null, max: null },
      parameters: [],
      parameter: {},
    })
    this.refs.TypeAhead.clearInput()
  }

  // Add parameter created via typeahead and range (if required)
  addParameter () {
    // Create parameter to break reference
    var parameter = Object.assign({}, this.state.parameter)

    // Find if duplicate of parameter exist
    // BUG IN FINDING OUT IF DUPLICATE EXIST
    var duplicate = this.state.parameters.find((d) => {
      isEqual(d, parameter)
    })

    // Validate parameter
    if (isBounded(parameter)) {
      var bounds = Object.assign({}, this.state.bounds)
      if (bounds.min === null || bounds.max === null) {
        Alert('Missing Range', 'danger', 4 * 1000)
        return
      } else if (bounds.min > bounds.max) {
        Alert('Invalid Parameter Range', 'danger', 4 * 1000)
        return
      }
    } else if (Object.keys(parameter).length < 1) {
      Alert('Invalid Parameter', 'danger', 4 * 1000)
      return
    } else if (duplicate !== undefined) {
      Alert('Parameter Already Exist', 'danger', 4 * 1000)
      return
    } else if (this.state.parameters.length > 0) {
      // Check if one already exist
      // console.log(duplicate.bound1.min, parameter.bounded1.min)
    }

    // Rebind parameter
    parameter.tval_char = null
    parameter.nval_num = null
    parameter.concept_path = null
    parameter.concept_cd = parameter.concept_cd
    parameter.valtype_cd = 'N'
    parameter.TableName = null
    parameter.TableColumn = null
    parameter.min = this.state.bounds.min
    parameter.max = this.state.bounds.max

    // Update state of parameters listing
    this.setState({
      parameters: this.state.parameters.concat(parameter)
    })
  }

  // Handle updating of parameter from TypeAhead
  updateParameter (parameter) {
    this.setState({
      parameter: parameter
    })
  }

  // Handle removal of parameter once Token clicked
  removeParameter (parameter) {
    this.setState({
      parameters: this.state.parameters.filter((d) => {
        return (d !== parameter) ? true : false
      })
    })
  }

  // Handle updating of selected question type
  handleSelectedType (index) {
    this.setState({
      selectedTypeIndex: index
    })
  }

  // Handle updating of selected question event
  handleSelectedEvent (index) {
    this.setState({
      selectedEventIndex: index
    })
  }

  // Handle updating of selected question event
  handleSelectedDemographic (index) {
    this.setState({
      selectedDemographicIndex: index,
      selectedDemographicValueIndex: null
    })

  }

  // Handle updating of selected question event
  handleSelectedDemographicValue (index) {
    this.setState({
      selectedDemographicValueIndex: index
    })
  }

  // Handle updating of question bounds
  updateBounds (bounds) {
    this.setState({
      bounds: bounds
    })
  }

  // Render question creator form
  render () {
    return (
      <Grid>
        <Row>
          {/* Question Type Dropdown */}
          <QuestionDropdown
            items={this.props.questionTypes}
            selectedIndex={this.state.selectedTypeIndex}
            handleSelect={this.handleSelectedType}
            defaultTitle={'Question Type'}
            objectParam={'Type'}
            id={1} />

          {/* Question Event Dropdown */}
          <QuestionDropdown
            items={this.props.questionEvents}
            selectedIndex={this.state.selectedEventIndex}
            handleSelect={this.handleSelectedEvent}
            defaultTitle={'Question Event'}
            objectParam={'Name'}
            id={2} />

          <strong> for patients with </strong>

          {/* TypeAhead for finding parameters */}
          <TypeAhead
            ref='TypeAhead'
            suggestions={this.props.suggestions}
            engine={this.props.searchEngine}
            key='ID'
            value='concept_cd'
            displayValue={(d) => {
              return d['concept_cd'] + ' (' + d['name_char'] +')'
            }}
            limit={10}
            handleToken={this.updateParameter}
          />

          {/* Create range input if required by parameter  */}
          { (Object.keys(this.state.parameter).length && isBounded(this.state.parameter)) ?
            <RangeInput
              bounds={this.state.bounds}
              updateBounds={this.updateBounds} /> :
            undefined
          }

          <Button bsStyle='primary' onClick={this.addParameter}>Add</Button>
        </Row>
        <Row>
          <strong> with these demographics </strong>
        </Row>
        <Row>
          <Col xs={2} md={2}>
            <QuestionDropdown
            items={this.props.demographics}
            selectedIndex={this.state.selectedDemographicIndex}
            handleSelect={this.handleSelectedDemographic}
            defaultTitle={'Demographic'}
            objectParam={'Name'}
            id={2} />
          </Col>
          <Col xs={2} md={2}>
          { this.props.demographics[this.state.selectedDemographicIndex] !== null &&
            this.state.selectedDemographicIndex !== null ?
              (this.props.demographics[this.state.selectedDemographicIndex].Name !== 'Age' ?
                <QuestionDropdown
                items={this.props.demographics[this.state.selectedDemographicIndex] === null || this.state.selectedDemographicIndex === null ?
                  [] :  this.props.demographics[this.state.selectedDemographicIndex].items }
                selectedIndex={this.state.selectedDemographicValueIndex}
                handleSelect={this.handleSelectedDemographicValue}
                defaultTitle={'Value'}
                objectParam={'Name'}
                id={2} /> :
                <RangeInput
                  bounds={this.state.bounds}
                  updateBounds={this.updateBounds}/>) :
              (<span/>)
          }
          </Col>
          <Col xs={2} md={2}>
            <Button bsStyle='primary' onClick={this.addParameter}>Add</Button>
          </Col>
        </Row>

        <Row>
          {/* Render parameters as tokens */}
          {this.state.parameters.map((parameter, i) => {
            return <Token
              key={i}
              value={'concept_cd'}
              token={parameter}
              removeToken={this.removeParameter} />
          })}
        </Row>
        <Row>
          {/* Create buttons for submitting/clearing question*/}
          <ButtonGroup>
            <Button bsStyle='success' onClick={this.submitQuestion}>Submit</Button>
            <Button bsStyle='danger' onClick={this.clearQuestion}>Clear</Button>
          </ButtonGroup>
        </Row>
      </Grid>
    )
  }
}

QuestionCreator.propTypes = {
  questionTypes: PropTypes.array,
  questionEvents: PropTypes.array,
  demographics: PropTypes.array,
  suggestions: PropTypes.array,
  searchEngine: PropTypes.any,
  handleSubmit: PropTypes.func
}

QuestionCreator.defaultProps = {
  questionTypes: [],
  questionEvents: [],
  suggestions: [],
  demographics: [],
  searchEngine: {},
  handleSubmit: () => {}
}

// Whitelist which parameters are bounded
const BOUNDED_PARAMETERS = [
  'LOINC'
]

const isBounded = (parameter) => {
  if (Object.keys(parameter).length === 0) {
    return false
  }

  var bounded = true
  BOUNDED_PARAMETERS.forEach((p) => {
    bounded = bounded && parameter.concept_cd.startsWith(p)
  })
  return bounded
}

// Creates token to display information about added parameters
class Token extends React.Component {
  constructor (props) {
    super(props)

    this.removeToken = this.removeToken.bind(this)
  }

  // Handle removal of token when clicked
  removeToken () {
    this.props.removeToken(this.props.token)
  }

  // Render token
  render () {
    return (
      <h4 className='token'>
        <Label className='label label-info' >
          {this.props.token[this.props.value] + ' '}
          <Glyphicon onClick={this.removeToken} glyph='remove' />
        </Label>
      </h4>
    )
  }
}

Token.propTypes = {
  removeToken: PropTypes.func,
  token: PropTypes.object,
  value: PropTypes.string
}

// Helper to render dropdowns for Question Type/Event
class QuestionDropdown extends React.Component {
  constructor (props) {
    super(props)

    this.handleSelect = this.handleSelect.bind(this)
    this.getTitle = this.getTitle.bind(this)
  }

  // Handle dropdown selection to update Question Type/Event
  handleSelect (undefined, type) {
    this.props.handleSelect(type)
  }

  // Set display tile to selected Question Type/Event
  getTitle () {
    return (this.props.selectedIndex !== null) ?
      this.props.items[this.props.selectedIndex][this.props.objectParam] :
      this.props.defaultTitle
  }

  // Render dropdown menu
  render () {
    return (
      <SplitButton
        title={this.getTitle()}
        id={'split-button-basic-' + this.props.id}
        onSelect={this.handleSelect}>

        {this.props.items.map((d, i) => {
          return <MenuItem key={i} eventKey={i}> {d[this.props.objectParam]} </MenuItem>
        })}

      </SplitButton>
    )
  }
}

QuestionDropdown.propTypes = {
  items: PropTypes.array,
  selectedIndex: PropTypes.number,
  objectParam: PropTypes.string,
  defaultTitle: PropTypes.string,
  id: PropTypes.number
}

// Create range input for questions that require upper/lower bounds
class RangeInput extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      min: '',
      max: ''
    }

    this.updateBounds = this.updateBounds.bind(this)
  }

  // Update parent component with bounds
  updateBounds () {
    var min = this.refs.min.getValue()
    var max = this.refs.max.getValue()
    min = (min !== '') ? parseInt(min) : null
    max = (max !== '') ? parseInt(max) : null
    this.setState({
      min: min,
      max: max
    })
    this.props.updateBounds({ min: min, max: max })
  }

  // Render input for getting question bounds
  render () {
    return (
      <div className='rangeInput'>
        <strong> between </strong>
        <Input type='number' ref='min'
          placeholder='Min'
          value={this.state.min}
          onChange={this.updateBounds} />
        <strong> and </strong>
        <Input type='number' ref='max'
          placeholder='Max'
          value={this.state.max}
          onChange={this.updateBounds} />
      </div>
    )
  }
}

RangeInput.propTypes = {
  updateBounds: PropTypes.func
}

export default QuestionCreator
