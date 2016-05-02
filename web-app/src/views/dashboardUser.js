import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Table, Well, ButtonGroup, Button, DropdownButton,
  Grid, Col, Row, MenuItem, Modal }
  from 'react-bootstrap'
import QuestionCreator from '../partials/questionCreator.js'
import CollapsibleTable from '../partials/collapsibleTable.js'
import Alert from '../partials/alert'

import api from '../api'
import config from '../config'

var refresh = null

// User Dashboard page uses partials question-creator and nemo-table
class UserDashboard extends React.Component {
  constructor (props) {
    super(props)

    this.updateUserQuestions = this.updateUserQuestions.bind(this)
    this.updateGlobalQuestions = this.updateGlobalQuestions.bind(this)
    this.handleAddQuestion = this.handleAddQuestion.bind(this)
    this.handleEditQuestion = this.handleEditQuestion.bind(this)
  }

  // Handler to api call to update user dashboard
  updateUserQuestions () {
    api.fetchUserData()
      .catch((err) => {
        Alert(err, 'danger', 4 * 1000)
      })
  }

  updateGlobalQuestions () {
    api.fetchGlobalData()
      .catch((err) => {
        Alert(err, 'danger', 4 * 1000)
      })
  }

  // Handler to api call to add question
  handleAddQuestion (question) {
    api.addQuestion(question)
      .then((msg) => {
        Alert(msg, 'success', 4 * 1000)
        this.updateUserQuestions()
        this.refs.QuestionCreator.clearQuestion()
      })
      .catch((err) => {
        Alert(err, 'danger', 4 * 1000)
      })
  }

  handleEditQuestion (question) {
    api.editQuestion(question)
      .then((msg) => {
        Alert(msg, 'success', 4 * 1000)
        this.updateUserQuestions()
        this.refs.QuestionCreator.clearQuestion()
      })
      .catch((err) => {
        Alert(err, 'danger', 4 * 1000)
      })
  }

  componentWillUnmount () {
    clearInterval(refresh)
  }

  // Once page is mounted attach page title
  componentDidMount () {
    document.title = 'Nemo User Dashboard'

    // Fetch user questions
    this.updateUserQuestions()
    this.updateGlobalQuestions()

    // Set periodic refresh of questions
    if (refresh === null) {
      refresh = window.setInterval(this.updateUserQuestions, config.UserDashRefreshRate)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (localStorage.getItem('question') !== null) {
      this.refs.QuestionCreator.updateState()
      Alert('Edit question', 'info', 4 * 1000)
    }
  }

  // Render user dashboard page
  render () {
    // Get number of questions the person has asked and has left to ask
    var questionsLeft = this.props.questions.length + '/' +
      localStorage.getItem('MaxQuestions')

    return (
      <Grid>
        <h3>Create a question</h3>
        <QuestionCreator
          ref='QuestionCreator'
          onClick={this.updateUserQuestions}
          questionTypes={this.props.questionTypes}
          questionEvents={this.props.questionEvents}
          suggestions={this.props.suggestions}
          demographics={this.props.demographics}
          searchEngine={this.props.searchEngine}
          handleAdd={this.handleAddQuestion}
          handleEdit={this.handleEditQuestion} />

        <h3> Questions Asked: {questionsLeft}
          <span className='glyphicon glyphicon-refresh pull-right hover-icon'
            onClick={this.updateUserQuestions} />
        </h3>
        <CollapsibleTable
          data={this.props.questions}
          numCols={3}
          headers={Headers}
          minimalRow={MinimalRow}
          hiddenRow={UserHiddenRow} />

        { localStorage.getItem('userType') === '1' ? ([
          <h3 key={1}> Offer feedback for others
            <span className='glyphicon glyphicon-refresh pull-right hover-icon'
              onClick={this.updateGlobalQuestions} />
          </h3>,
          <CollapsibleTable key={2}
            data={this.props.otherQuestions}
            numCols={3}
            headers={Headers}
            minimalRow={MinimalRow}
            hiddenRow={OthersHiddenRow} />
          ]) : undefined }
      </Grid>
    )
  }
}

UserDashboard.propTypes = {
  questions: PropTypes.array,
  otherQuestions: PropTypes.array,
  questionTypes: PropTypes.array,
  questionEvents: PropTypes.array,
  suggestions: PropTypes.array,
  demographics: PropTypes.array,
  searchEngine: PropTypes.any
}

UserDashboard.defaultProps = {
  questions: [],
  otherQuestions: [],
  questionTypes: [],
  questionEvents: [],
  suggestions: [],
  demographics: [],
  searchEngine: {}
}

const mapStateToProps = (state) => ({
  questions: state.nemoQuestions.userQuestions,
  otherQuestions: state.nemoQuestions.globalQuestions.filter((d) => {
    return d.User.UserType.ID === 2 &&
      d.StatusID === 3 &&
      d.AIModels.length > 0
  }),
  questionTypes: state.questionCreator.questionTypes,
  questionEvents: state.questionCreator.questionEvents,
  suggestions: state.questionCreator.suggestions,
  demographics: state.questionCreator.demographics,
  searchEngine: state.questionCreator.searchEngine
})

export default connect((mapStateToProps), {})(UserDashboard)

/* Below are the generators for the html used by collapisble table */

// Creates the headders used by table
const Headers = () => {
  return ([
    <td key={1}>Question</td>,
    <td key={2}>Parameters</td>,
    <td key={3}>Status</td>
  ])
}

// Creates the minimal visible row used by table
const MinimalRow = (data) => {
  // Create question name string
  var question = data.QuestionType.Type + ' ' +
    data.QuestionEvent.Name

  // Display only 3 parameters at most to display
  var parameters = ''
  var numParams = Math.min(data['QuestionParameters'].length, 3)
  for (var i = 0; i < numParams; i++) {
    parameters += data['QuestionParameters'][i]['concept_cd']
    parameters += (i !== numParams - 1)
      ? ', '
      : (numParams < data['QuestionParameters'].length) ? ' . . .' : ''
  }

  // Get question status to display
  var status = data.QuestionStatus.Status
  return ([
    <td key={1} >{question}</td>,
    <td key={2} >{parameters}</td>,
    <td key={3} >{status}</td>
  ])
}

// Creates the hidden row used by Table
// This table is for the current user
class UserHiddenRow extends React.Component {
  constructor (props, context) {
    super(props)

    context.router

    this.handleEdit = this.handleEdit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleFeedback = this.handleFeedback.bind(this)
    this.handlePatient = this.handlePatient.bind(this)
    this.handleAlgorithm = this.handleAlgorithm.bind(this)
    this.handlePredict = this.handlePredict.bind(this)
  }

  handleEdit () {
    // Store data to be copied into question creator
    localStorage.setItem('question', JSON.stringify(this.props.data))

    // Redirect to question user dashboard (Triggers prop update)
    this.context.router.replace('/user')
  }

  handlePredict () {
    var id = this.props.data.ID
    var mark = this.refs['predict_yes' + id].checked
    api.markPrediction(this.props.data.ID, mark)
      .then((msg) => {
        Alert(msg, 'success', 4 * 1000)
        api.fetchUserData()
          .catch((err) => {
            Alert(err, 'danger', 4 * 1000)
          })
      })
      .catch((err) => {
        Alert(err, 'danger', 4 * 1000)
      })
  }

  // Create modal to handle editing of question classifer and optimizer
  handleAlgorithm () {
    var mountPoint = document.getElementById('modal')
    ReactDOM.render(
      <AlgorithmModal data={this.props.data} mountPoint={mountPoint} />,
      mountPoint
    )
  }

  // Create modal to handle editing of patient used for prediction
  handlePatient () {
    var mountPoint = document.getElementById('modal')
    ReactDOM.render(
      <PatientModal data={this.props.data} mountPoint={mountPoint} />,
      mountPoint
    )
  }

  // Handler to api call to delete question
  handleDelete () {
    api.deleteQuestion(this.props.data.ID)
      .then((msg) => {
        Alert(msg, 'success', 4 * 1000)
        api.fetchUserData()
          .then((msg) => {
            this.props.collapsibleTableCloseAll()
          })
          .catch((err) => {
            Alert(err, 'danger', 4 * 1000)
          })
      })
      .catch((err) => {
        Alert(err, 'danger', 4 * 1000)
      })
  }

  // Handler to api call to give feedback to question
  handleFeedback () {
    var acc_yes = this.refs.satisfied_acc_yes.checked
    var acc_no = this.refs.satisfied_acc_no.checked
    var id = this.props.data.AIModels[0].ID
    if (acc_yes || acc_no) {
      var params = {}
      params.aiModelID = id
      params.accFeedback = acc_yes

      if (this.props.data.Prediction !== null && this.props.data.MakePrediction) {
        var predict_yes = this.refs.satisfied_predict_yes.checked
        var predict_no = this.refs.satisfied_predict_no.checked
        if (predict_yes || predict_no) {
          params.prdFeedback = predict_yes
        } else {
          Alert('Missng prediction feedback', 'danger', 4 * 1000)
          return
        }
      } else {
        params.prdFeedback = null
      }

      api.giveFeedback(params)
        .then((msg) => {
          Alert(msg, 'success', 4 * 1000)
          api.fetchUserData()
            .catch((err) => {
              Alert(err, 'danger', 4 * 1000)
            })
        })
        .catch((err) => {
          Alert(err, 'danger', 4 * 1000)
        })
    }
  }

  // Render well
  render () {
    var data = this.props.data

    // Get Question realted info
    var id = data.ID
    var question = data.QuestionType.Type + ' ' +
      data.QuestionEvent.Name
    var paramsLong = ''
    var numParams = data['QuestionParameters'].length
    for (var i = 0; i < numParams; i++) {
      paramsLong += data['QuestionParameters'][i]['concept_cd']
      paramsLong += (i !== numParams - 1) ? ', ' : ''
    }

    // Get prediction related info
    var runningPredict = false
    if (data.MakePrediction) {
      runningPredict = true
    }
    var hasPrediction = false
    var prediction = ''
    if (data.Prediction !== null) {
      hasPrediction = true
      prediction = data.Prediction ? 'true' : 'false'
    }

    // Get AI related info
    var currentOptimizer = ''
    var currentClassifier = ''
    var status = data.QuestionStatus.Status
    var optimizer = ''
    var classifier = ''
    var accuracy = ''
    var matrix = ''
    var hasFeedback = data.StatusID === 3

    // Get data related to most recent AI model if one exist
    if (data.AIModels.length > 0) {
      var aiModel = data.AIModels[0]
      optimizer = aiModel.Optimizer
      classifier = aiModel.Algorithm
      accuracy = aiModel.Accuracy

      var confusionMatrix = JSON.parse(aiModel.ConfusionMatrix)
      matrix = (
        <Table condensed>
          <tbody>
            <tr>
              <td>{confusionMatrix[0][0]}</td>
              <td>{confusionMatrix[0][1]}</td>
            </tr>
            <tr>
              <td>{confusionMatrix[1][0]}</td>
              <td>{confusionMatrix[1][1]}</td>
            </tr>
          </tbody>
        </Table>
      )
    }

    return (
      <Well bsStyle='sm'>
        <Row className='hiddenRowWell'>
          <Col sm={6} md={6}>
            <Row>
              <dl className='dl-horizontal'>
                <dt>Question: </dt>
                <dd>{question} </dd>
                <dt>Parameters: </dt>
                <dd>{paramsLong} </dd>
              </dl>
            </Row>
            <Row>
              Run predictions on this question?
              <span>{'  Yes'}</span>
              <input onChange={this.handlePredict} ref={'predict_yes' + id}
                type='radio' name={'predict' + id}
                value={runningPredict} checked={runningPredict} />
              <span>{'  No'}</span>
              <input onChange={this.handlePredict} ref={'predict_no' + id}
                type='radio' name={'predict' + id}
                value={!runningPredict} checked={!runningPredict} /><br/>
              {(hasPrediction && runningPredict) ?
                <span>
                  Latest prediction for the current patient is {prediction}.
                </span>
              : undefined}
            </Row>
            {(hasFeedback && localStorage.getItem('userType') === '1') ?
              <Row>
                <br/>
                <label>Feedback Required:</label>
                <form>
                  Are you satisfied with the accuracy?
                  <span>{'  Yes'}</span>
                  <input ref='satisfied_acc_yes' type='radio' name='accFeedback' value={1} />
                  <span>{'  No'}</span>
                  <input ref='satisfied_acc_no' type='radio' name='accFeedback' value={0} /><br/>
                  {(hasPrediction && runningPredict) ?
                    <span>
                      Are you satisfied with the prediction?
                      <span>{'  Yes'}</span>
                      <input ref='satisfied_predict_yes' type='radio' name='predictFeedback' value={1} />
                      <span>{'  No'}</span>
                      <input ref='satisfied_predict_no' type='radio' name='predictFeedback' value={0} /><br/>
                    </span>
                  : undefined}
                  <Button className='pull-left' bsSize='xsmall' bsStyle='primary' onClick={this.handleFeedback}>
                    Submit Feedback
                  </Button>
                </form>
              </Row>
              : undefined}
          </Col>
          <Col sm={6} md={6}>
            <Row>
              <dl className='dl-horizontal'>
                <dt>Status: </dt>
                <dd>{status}</dd>
                <dt>Optimizer: </dt>
                <dd>{optimizer}</dd>
                <dt>Classifier: </dt>
                <dd>{classifier}</dd>
                <dt>Accuracy: </dt>
                <dd>{accuracy}</dd>
                <dt>Confusion Matrix: </dt>
                <dd>{matrix}</dd>
              </dl>
            </Row>
            <Row>
              <ButtonGroup className='pull-right'>
                <Button bsSize='xsmall' bsStyle='info' onClick={this.handleAlgorithm}>
                  Edit Algorithm
                </Button>
                <Button bsSize='xsmall' bsStyle='success' onClick={this.handlePatient}>
                  Edit Patient
                </Button>
                <Button bsSize='xsmall' bsStyle='warning' onClick={this.handleEdit}>
                  Edit Question
                </Button>
                <Button bsSize='xsmall' bsStyle='danger' onClick={this.handleDelete}>
                  Delete
                </Button>
              </ButtonGroup>
            </Row>
          </Col>
        </Row>
      </Well>
    )
  }
}

UserHiddenRow.contextTypes = {
  router: PropTypes.object.isRequired
}

UserHiddenRow.propTypes = {
  data: PropTypes.any
}

// Creates the hidden row used by Table
// This table is for the current user to give non domain experts feedback
class OthersHiddenRow extends React.Component {
  constructor (props) {
    super(props)

    this.handleFeedback = this.handleFeedback.bind(this)
  }

  // Handler to api call to give feedback to question
  handleFeedback () {
    var acc_yes = this.refs.satisfied_acc_yes.checked
    var acc_no = this.refs.satisfied_acc_no.checked
    var id = this.props.data.AIModels[0].ID
    if (acc_yes || acc_no) {
      var params = {}
      params.aiModelID = id
      params.accFeedback = acc_yes

      if (this.props.data.Prediction !== null && this.props.data.MakePrediction) {
        var predict_yes = this.refs.satisfied_predict_yes.checked
        var predict_no = this.refs.satisfied_predict_no.checked
        if (predict_yes || predict_no) {
          params.prdFeedback = predict_yes
        } else {
          Alert('Missng prediction feedback', 'danger', 4 * 1000)
          return
        }
      } else {
        params.prdFeedback = null
      }

      api.giveFeedback(params)
        .then((msg) => {
          Alert(msg, 'success', 4 * 1000)
          this.props.collapsibleTableCloseAll()
          api.fetchGlobalData()
            .catch((err) => {
              Alert(err, 'danger', 4 * 1000)
            })
        })
        .catch((err) => {
          Alert(err, 'danger', 4 * 1000)
        })
    }
  }

  // Render well
  render () {
    var data = this.props.data

    // Get Question realted info
    var id = data.ID
    var question = data.QuestionType.Type + ' ' +
      data.QuestionEvent.Name
    var paramsLong = ''
    var numParams = data['QuestionParameters'].length
    for (var i = 0; i < numParams; i++) {
      paramsLong += data['QuestionParameters'][i]['concept_cd']
      paramsLong += (i !== numParams - 1) ? ', ' : ''
    }

    // Get prediction related info
    var runningPredict = false
    if (data.MakePrediction) {
      runningPredict = true
    }
    var hasPrediction = false
    var prediction = ''
    if (data.Prediction !== null) {
      hasPrediction = true
      prediction = data.Prediction ? 'true' : 'false'
    }

    // Get AI related info
    var currentOptimizer = ''
    var currentClassifier = ''
    var status = data.QuestionStatus.Status
    var optimizer = ''
    var classifier = ''
    var accuracy = ''
    var matrix = ''
    var hasFeedback = data.StatusID === 3

    // Get data related to most recent AI model if one exist
    if (data.AIModels.length > 0) {
      var aiModel = data.AIModels[0]
      optimizer = aiModel.Optimizer
      classifier = aiModel.Algorithm
      accuracy = aiModel.Accuracy

      var confusionMatrix = JSON.parse(aiModel.ConfusionMatrix)
      matrix = (
        <Table condensed>
          <tbody>
            <tr>
              <td>{confusionMatrix[0][0]}</td>
              <td>{confusionMatrix[0][1]}</td>
            </tr>
            <tr>
              <td>{confusionMatrix[1][0]}</td>
              <td>{confusionMatrix[1][1]}</td>
            </tr>
          </tbody>
        </Table>
      )
    }

    return (
      <Well bsStyle='sm'>
        <Row className='hiddenRowWell'>
          <Col sm={6} md={6}>
            <Row>
              <dl className='dl-horizontal'>
                <dt>Question: </dt>
                <dd>{question} </dd>
                <dt>Parameters: </dt>
                <dd>{paramsLong} </dd>
              </dl>
            </Row>
            <Row>
              {(hasPrediction && runningPredict) ?
                <span>
                  Latest prediction for the current patient is {prediction}.
                </span>
              : undefined}
            </Row>
            {(hasFeedback && localStorage.getItem('userType') === '1') ?
              <Row>
                <br/>
                <label>Feedback Required:</label>
                <form>
                  Are you satisfied with the accuracy?
                  <span>{'  Yes'}</span>
                  <input ref='satisfied_acc_yes' type='radio' name='accFeedback' value={1} />
                  <span>{'  No'}</span>
                  <input ref='satisfied_acc_no' type='radio' name='accFeedback' value={0} /><br/>
                  {(hasPrediction && runningPredict) ?
                    <span>
                      Are you satisfied with the prediction?
                      <span>{'  Yes'}</span>
                      <input ref='satisfied_predict_yes' type='radio' name='predictFeedback' value={1} />
                      <span>{'  No'}</span>
                      <input ref='satisfied_predict_no' type='radio' name='predictFeedback' value={0} /><br/>
                    </span>
                  : undefined}
                  <Button className='pull-left' bsSize='xsmall' bsStyle='primary' onClick={this.handleFeedback}>
                    Submit Feedback
                  </Button>
                </form>
              </Row>
              : undefined}
          </Col>
          <Col sm={6} md={6}>
            <Row>
              <dl className='dl-horizontal'>
                <dt>Status: </dt>
                <dd>{status}</dd>
                <dt>Optimizer: </dt>
                <dd>{optimizer}</dd>
                <dt>Classifier: </dt>
                <dd>{classifier}</dd>
                <dt>Accuracy: </dt>
                <dd>{accuracy}</dd>
                <dt>Confusion Matrix: </dt>
                <dd>{matrix}</dd>
              </dl>
            </Row>
          </Col>
        </Row>
      </Well>
    )
  }
}

OthersHiddenRow.propTypes = {
  data: PropTypes.any
}

class ObservationFactForm extends React.Component {
  constructor (props){
    super(props)

    this.state = {
      nval_num: (typeof this.props.data === 'undefined') ? '' : this.props.data.nval_num,
      tval_char: (typeof this.props.data === 'undefined') ? '' : this.props.data.tval_char
    }

    this.handleNvalnum = this.handleNvalnum.bind(this)
    this.handleTvalchar = this.handleTvalchar.bind(this)
    this.getObservationFacts = this.getObservationFacts.bind(this)
  }

  // Set nval num for observation fact
  handleNvalnum () {
    var x = this.refs['nval_num'].value
    x = (x !== '') ? parseInt(x) : null
    this.setState({
      nval_num: x,
    })
  }

  // Set tval char for observation fact
  handleTvalchar () {
    var x = this.refs['tval_char'].value
    this.setState({
      tval_char: x
    })
  }

  // Getter for grabbing nval, tval for observation fact
  getObservationFacts () {
    return {
      nval_num: this.state.nval_num,
      tval_char: this.state.tval_char
    }
  }

  render () {
    return (
      <div className='form-group'>
        <label className='col-sm-2 control-label'>
          {this.props.concept_cd}
        </label>
        <div className='col-sm-5'>
          <input type='number'
            ref='nval_num'
            placeholder='nval_num'
            className='form-control'
            value={this.state.nval_num}
            onChange={this.handleNvalnum} />
        </div>
        <div className='col-sm-5'>
        <input type='text'
          ref='tval_char'
          placeholder='tval_char'
          className='form-control'
          value={this.state.tval_char}
          onChange={this.handleTvalchar} />
        </div>
     </div>
    )
  }
}

ObservationFactForm.defaultProps = {
  concept_cd: null
}

class PatientModal extends React.Component {

  constructor (props){
    super(props)

    var patient = JSON.parse(this.props.data.PatientJSON)

    this.state = {
      sex_cd: (patient === null) ? '' : patient.sex_cd,
      race_cd: (patient === null) ? '' : patient.race_cd,
      age_in_years: (patient === null) ? '' : patient.age_in_years_num,
      observation_facts: (patient === null) ? '' : patient.observation_facts
    }

    this.close = this.close.bind(this)
    this.handleSexDropdownSelect = this.handleSexDropdownSelect.bind(this)
    this.handleRaceDropdownSelect = this.handleRaceDropdownSelect.bind(this)
    this.handleAgeSelect = this.handleAgeSelect.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  close () {
    // Dirty trick to prevent error logs
    // Hopefully fixed in future versions of React
    setTimeout(()=> {
      ReactDOM.unmountComponentAtNode(this.props.mountPoint)
    }, 100);
  }

  handleSexDropdownSelect (key, index){
    this.setState({
      sex_cd: this.props.sex_cd_options[index],
    })
  }

  handleRaceDropdownSelect (key, index){
    this.setState({
      race_cd: this.props.race_cd_options[index],
    })
  }

  handleAgeSelect () {
    var age = this.refs.age.value
    age = (age !== '') ? parseInt(age) : null
    if(age > 150){
      age = 150
    }
    if(age < 0){
      age = 0
    }
    this.setState({
     age_in_years: age
    })
  }

  handleSubmit () {
    var patient = {
      sex_cd: this.state.sex_cd,
      race_cd: this.state.race_cd,
      age_in_years_num: this.state.age_in_years,
      observation_facts: []
    }

    this.props.data.QuestionParameters.forEach((d, i) => {
      var observations = this.refs['observationFact' + i].getObservationFacts()
      var fact = {
        concept_cd: d.concept_cd,
        tval_char:  observations.tval_char,
        nval_num: observations.nval_num
      }
      patient.observation_facts.push(fact)
    })

    api.editPatient(this.props.data.ID, patient)
      .then((msg) => {
        Alert(msg, 'success', 4 * 1000)
        this.close()
      })
      .catch((err) => {
        Alert(err, 'danger', 4 * 1000)
      })
  }

  render () {
    var data = this.props.data

    return (
      <Modal ref='Modal' id='Modal' show>
        <Modal.Header>
          <Modal.Title>Edit Patient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className='form-horizontal'>
            <div className='form-group'>
              <label className='col-sm-2 control-label'>Sex: </label>
              <div className='col-sm-10'>
                <DropdownButton id={1} title={this.state.sex_cd}
                  onSelect={this.handleSexDropdownSelect}>
                  {this.props.sex_cd_options.map((d, i) => {
                    return <MenuItem key={i} eventKey={i}> {d} </MenuItem>
                  })}
                </DropdownButton>
              </div>
            </div>
            <div className='form-group'>
              <label className='col-sm-2 control-label'>Race: </label>
              <div className='col-sm-10'>
                <DropdownButton id={2} title={this.state.race_cd}
                  onSelect={this.handleRaceDropdownSelect}>
                  {this.props.race_cd_options.map((d, i) => {
                    return <MenuItem key={i} eventKey={i}> {d} </MenuItem>
                  })}
                </DropdownButton>
              </div>
            </div>
            <div className='form-group'>
              <label className='col-sm-2 control-label'>Age: </label>
              <div className='col-sm-10'>
                <input type='number' ref='age' className='form-control'
                  placeholder='Age'
                  value={this.state.age_in_years}
                  onChange={this.handleAgeSelect}
                  min='0'
                  max='150'/>
              </div>
            </div>
            {this.props.data.QuestionParameters.map((d, i) => {
              return <ObservationFactForm key={i}
                ref={'observationFact' + i}
                concept_cd={d.concept_cd}
                data={this.state.observation_facts[i]}/>
            })}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button className='pull-left' onClick={this.handleSubmit} bsStyle='primary'>Save</Button>
          <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

PatientModal.defaultProps = {
  sex_cd_options: config.Demographics.sex_cd,
  race_cd_options: config.Demographics.race_cd
}

class AlgorithmModal extends React.Component {

  constructor(props){
    super(props)

    var data = this.props.data
    this.state = {
      optimizer: (data.Optimizer === null) ? 'Random' : data.Optimizer,
      classifier: (data.Classifier === null) ? 'Random' : data.Classifier
    }

    this.close = this.close.bind(this)
    this.handleOptimizerSelect = this.handleOptimizerSelect.bind(this)
    this.handleClassifierSelect = this.handleClassifierSelect.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  close () {
    // Dirty trick to prevent error logs
    // Hopefully fixed in future versions of React
    setTimeout(()=> {
      ReactDOM.unmountComponentAtNode(this.props.mountPoint)
    }, 100);
  }

  handleOptimizerSelect(key, index){
    this.setState({
      optimizer: this.props.optimizer_options[index]
    })
  }

  handleClassifierSelect(key, index){
    this.setState({
      classifier: this.props.classifier_options[index]
    })
  }

  handleSubmit () {
    var data = {
      optimizer: this.state.optimizer === 'Random' ? null : this.state.optimizer,
      classifier:this.state.classifier === 'Random' ? null : this.state.classifier
    }

    api.editAlgorithm(this.props.data.ID, data)
      .then((msg) => {
        Alert(msg, 'success', 4 * 1000)
        this.close()
      })
      .catch((err) => {
        Alert(err, 'danger', 4 * 1000)
      })
  }

  render() {
    return (
      <Modal ref='Modal' id='Modal' show>
        <Modal.Header>
          <Modal.Title>Edit Optimizer and Classifier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className='form-horizontal'>
            <div className='form-group'>
              <label className='col-sm-2 control-label'>Optimizer:</label>
              <div className='col-sm-10'>
                <DropdownButton id={1} title={this.state.optimizer} onSelect={this.handleOptimizerSelect}>
                  {this.props.optimizer_options.map((d, i) => {
                    return <MenuItem key={i} eventKey={i}> {d} </MenuItem>
                  })}
                </DropdownButton>
              </div>
            </div>
            <div className='form-group'>
              <label className='col-sm-2 control-label'>Classifier:</label>
              <div className='col-sm-10'>
                <DropdownButton id={2} title={this.state.classifier} onSelect={this.handleClassifierSelect}>
                  {this.props.classifier_options.map((d, i) => {
                    return <MenuItem key={i} eventKey={i}> {d} </MenuItem>
                  })}
                </DropdownButton>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button className='pull-left' onClick={this.handleSubmit} bsStyle='primary'>Save</Button>
          <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

AlgorithmModal.defaultProps = {
  optimizer_options: config.Optimizers,
  classifier_options: config.Classifiers
}
