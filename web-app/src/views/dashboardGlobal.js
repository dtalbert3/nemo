import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Table, Well, Button, Grid, Col, Row } from 'react-bootstrap'
import CollapsibleTable from '../partials/collapsibleTable.js'

import api from '../api'
import config from '../config'
import { objectByString } from '../util'

var refresh = null

// User Dashboard page uses partials question-creator and nemo-table
class GlobalDashboard extends React.Component {
  constructor (props) {
    super(props)

    this.updateGlobalQuestions = this.updateGlobalQuestions.bind(this)
  }

  updateGlobalQuestions () {
    api.fetchGlobalData()
  }

  componentWillUnmount () {
    clearInterval(refresh)
  }

  // Once page is mounted attach page title
  componentDidMount () {
    document.title = 'Nemo Global Dashboard'

    // Fetch user questions
    api.fetchGlobalData()

    // Set periodic refresh of questions
    if (refresh === null) {
      refresh = window.setInterval(this.updateGlobalQuestions, config.UserDashRefreshRate)
    }
  }

  // Render user dashboard page
  render () {
    return (
      <Grid>
        <h2>Global Questions</h2>
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

GlobalDashboard.propTypes = {
  questions: PropTypes.array
}

GlobalDashboard.defaultProps = {
  questions: []
}

const mapStateToProps = (state) => ({
  questions: state.nemoQuestions.globalQuestions
})

export default connect((mapStateToProps), {})(GlobalDashboard)

const Headers = () => {
  return ([
    <td key={1} >Question</td>,
    <td key={2} >Parameters</td>,
    <td key={3} >Status</td>
  ])
}

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

// Helper to create well with extra information on submitted questions
class HiddenRow extends React.Component {
  constructor (props) {
    super(props)

    this.handleCopy = this.handleCopy.bind(this)
  }

  handleCopy () {
    // Insert question into local storage
    // Load user dashboard
    // Load up question creator
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
          <Col sm={6} md={6} smOffset={6} mdOffset={6}>
            <Button className='pull-right' bsSize='xsmall' bsStyle='primary' onClick={this.handleCopy}>
              Copy Question
            </Button>
          </Col>
        </Row>
      </Well>
    )
  }
}

HiddenRow.propTypes = {
  data: PropTypes.any
}
