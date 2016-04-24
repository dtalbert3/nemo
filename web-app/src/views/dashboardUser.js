import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Table, Well, ButtonGroup, Button, Grid, Col, Row } from 'react-bootstrap'
import QuestionCreator from '../partials/questionCreator.js'
import CollapsibleTable from '../partials/collapsibleTable.js'
import Alert from '../partials/alert'

import api from '../api'
import config from '../config'
import { objectByString } from '../util'

var refresh = null

// User Dashboard page uses partials question-creator and nemo-table
class UserDashboard extends React.Component {
  constructor (props) {
    super(props)

    this.updateUserQuestions = this.updateUserQuestions.bind(this)
    this.handleSubmitQuestion = this.handleSubmitQuestion.bind(this)
  }

  updateUserQuestions () {
    api.fetchUserData()
      .catch((err) => {
        Alert(err, 'danger', 4 * 1000)
      })
  }

  handleSubmitQuestion (question) {
    api.addQuestion(question)
      .then((msg) => {
        Alert(msg, 'success', 4 * 1000)
        this.updateUserQuestions()
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
    api.fetchUserData()
      .catch((err) => {
        Alert(err, 'danger', 4 * 1000)
      })

    // Set periodic refresh of questions
    if (refresh === null) {
      refresh = window.setInterval(this.updateUserQuestions, config.UserDashRefreshRate)
    }
  }

  // Render user dashboard page
  render () {
    var questionsLeft = this.props.questions.length + '/' +
      localStorage.getItem('MaxQuestions')

    return (
      <Grid>
        <h2>Create a question</h2>
        <QuestionCreator
          ref='QuestionCreator'
          onClick={this.updateUserQuestions}
          questionTypes={this.props.questionTypes}
          questionEvents={this.props.questionEvents}
          suggestions={this.props.suggestions}
          demographics={this.props.demographics}
          searchEngine={this.props.searchEngine}
          handleSubmit={this.handleSubmitQuestion} />

        <h2>Your Questions <span className='pull-right'>{questionsLeft} Questions Asked</span>
        </h2>
        <CollapsibleTable
          data={this.props.questions}
          numCols={3}
          headers={Headers}
          minimalRow={MinimalRow}
          hiddenRow={HiddenRow} />
      </Grid>
    )
  }
}

UserDashboard.propTypes = {
  questions: PropTypes.array,
  questionTypes: PropTypes.array,
  questionEvents: PropTypes.array,
  suggestions: PropTypes.array,
  demographics: PropTypes.array,
  searchEngine: PropTypes.any
}

UserDashboard.defaultProps = {
  questions: [],
  questionTypes: [],
  questionEvents: [],
  suggestions: [],
  demographics: [],
  searchEngine: {}
}

const mapStateToProps = (state) => ({
  questions: state.nemoQuestions.userQuestions,
  questionTypes: state.questionCreator.questionTypes,
  questionEvents: state.questionCreator.questionEvents,
  suggestions: state.questionCreator.suggestions,
  demographics: state.questionCreator.demographics,
  searchEngine: state.questionCreator.searchEngine
})

export default connect((mapStateToProps), {})(UserDashboard)

// Below are the generators for the html used by collapisble table
// Creates the headders used by table
const Headers = () => {
  return ([
    <td key={1} >Question</td>,
    <td key={2} >Parameters</td>,
    <td key={3} >Status</td>
  ])
}

// Creates the minimal visible row used by table
const MinimalRow = (data) => {
  var question = objectByString(data, 'QuestionType.Type') + ' ' +
    objectByString(data, 'QuestionEvent.Name')
  var parameters = ''
  var numParams = Math.min(data['QuestionParameters'].length, 3)
  for (var i = 0; i < numParams; i++) {
    parameters += data['QuestionParameters'][i]['concept_cd']
    parameters += (i !== numParams - 1)
      ? ', '
      : (numParams < data['QuestionParameters'].length) ? ' . . .' : ''
  }
  var status = objectByString(data, 'QuestionStatus.Status')
  return ([
    <td key={1} >{question}</td>,
    <td key={2} >{parameters}</td>,
    <td key={3} >{status}</td>
  ])
}

// Creates the hidden row used by the table filled with functionality for nemo
class HiddenRow extends React.Component {
  constructor (props) {
    super(props)

    this.handleEdit = this.handleEdit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleFeedback = this.handleFeedback.bind(this)
  }

  handleEdit () {

  }

  handleDelete () {
    api.deleteQuestion(this.props.data.ID)
      .then((msg) => {
        Alert(msg, 'success', 4 * 1000)
        api.fetchUserData()
          .catch((err) => {
            Alert(err, 'danger', 4 * 1000)
          })
        this.props.collapsibleTableCloseAll()
      })
      .catch((err) => {
        Alert(err, 'danger', 4 * 1000)
      })
  }

  handleFeedback () {
    var yes = this.refs.yes.checked
    var no = this.refs.no.checked
    var id = this.props.data.AIModels[0].ID
    if (yes || no) {
      var params = {}
      params.aiModelID = id
      if (yes) {
        params.value = 1
      } else {
        params.value = 0
      }
      api.giveFeedback(params)
        .then((msg) => {
          Alert(msg, 'success', 4 * 1000)
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
    var question = objectByString(data, 'QuestionType.Type') + ' ' +
      objectByString(data, 'QuestionEvent.Name')
    var paramsLong = ''
    var paramsShort = ''
    var numParams = data['QuestionParameters'].length
    for (var i = 0; i < numParams; i++) {
      paramsLong += data['QuestionParameters'][i]['concept_cd']
      paramsLong += (i !== numParams - 1) ? ', ' : ''
      if (i < 3) {
        paramsShort += data['QuestionParameters'][i]['concept_cd']
        paramsShort += (i !== 2 && i !== numParams - 1) ? ', ' : ''
        if (i === 2 && numParams > 3) {
          paramsShort += ' . . .'
        }
      }
    }

    // Get AI related info
    var status = objectByString(data, 'QuestionStatus.Status')
    var classifier = ''
    var accuracy = ''
    var matrix = ''
    var hasFeedback = data.StatusID === 3
    if (data.AIModels.length > 0) {
      var aiModel = data.AIModels[0]
      classifier = aiModel.Algorithm
      accuracy = aiModel.Accuracy

      var confusionMatrix = JSON.parse(aiModel.ConfusionMatrix)
      matrix = (
        <Table condensed>
          <thead>
            <tr>
              <th></th>
              <th>+</th>
              <th>-</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>+</td>
              <td>{confusionMatrix[0][0]}</td>
              <td>{confusionMatrix[0][1]}</td>
            </tr>
            <tr>
              <td>-</td>
              <td>{confusionMatrix[1][0]}</td>
              <td>{confusionMatrix[1][1]}</td>
            </tr>
          </tbody>
        </Table>
      )
    }

    return (
      <Well bsStyle='sm'>
        <Row>
          <Col sm={6} md={6}>
            <dl className='dl-horizontal'>
              <dt>Question: </dt>
              <dd>{question}</dd>
              <dt>Parameters: </dt>
              <dd>{paramsLong}</dd>
            </dl>
          </Col>
          <Col sm={6} md={6}>
            <dl className='dl-horizontal'>
              <dt>Status: </dt>
              <dd>{status}</dd>
              <dt>Classifier: </dt>
              <dd>{classifier}</dd>
              <dt>Accuracy: </dt>
              <dd>{accuracy}</dd>
              <dt>Confusion Matrix: </dt>
              <dd>{matrix}</dd>
            </dl>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12}>
            {(hasFeedback && localStorage.getItem('userType') === 1) ?
              <form>
                Are you satisfied with the accuracy?
                <span>{'  Yes'}</span>
                <input ref='yes' type='radio' name='accFeedback' value={1} />
                <span>{'  No'}</span>
                <input ref='no' type='radio' name='accFeedback' value={0} />
              </form>
              : undefined}
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={6}>
            {(hasFeedback && localStorage.getItem('userType') === 1) ?
              <Button className='pull-left' bsSize='xsmall' bsStyle='primary' onClick={this.handleFeedback}>
                Submit Feedback
              </Button>
            : undefined}
          </Col>
          <Col sm={6} md={6}>
            <ButtonGroup className='pull-right'>
              <Button bsSize='xsmall' bsStyle='warning' onClick={this.handleEdit}>
                Edit
              </Button>
              <Button bsSize='xsmall' bsStyle='danger' onClick={this.handleDelete}>
                Delete
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Well>
    )
  }
}

HiddenRow.propTypes = {
  data: PropTypes.any
}
