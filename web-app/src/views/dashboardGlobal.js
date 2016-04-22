import React from 'react';
import { connect } from 'react-redux';
import { Well, Button, Grid, Col, Row } from 'react-bootstrap';
import CollapsibleTable from '../partials/collapsibleTable.js';
import Alert from '../partials/alert';

import api from '../api';
import config from '../config';
import { objectByString } from '../util';

var refresh = null;

// User Dashboard page uses partials question-creator and nemo-table
const GlobalDashboard = React.createClass({

  updateGlobalQuestions() {
    api.fetchGlobalData();
  },

  handleSubmitQuestion(question) {
    api.addQuestion(question)
      .then(() => {
        this.updateGlobalQuestions();
      });
  },

  componentWillUnmount() {
    clearInterval(refresh);
  },

  // Once page is mounted attach page title
  componentDidMount() {
    document.title = 'Nemo Global Dashboard';

    // Fetch user questions
    api.fetchGlobalData();

    // Set periodic refresh of questions
    if (refresh === null) {
      refresh = window.setInterval(this.updateGlobalQuestions, config.UserDashRefreshRate);
    }
  },

  getDefaultProps: function() {
    return {
      questions: [],
    };
  },

  getInitialState() {
    return {
      refresh: null
    };
  },

  // Render user dashboard page
  render() {
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
    );
  }
});

const mapStateToProps = (state) => ({
  questions: state.nemoQuestions.globalQuestions,
});

export default connect((mapStateToProps), {})(GlobalDashboard);

const Headers = () => {
  return ([
    <td key={1} >Question</td>,
    <td key={2} >Parameters</td>,
    <td key={3} >Status</td>
  ]);
};

const MinimalRow = (data) => {
  var question = objectByString(data, 'QuestionType.Type') + ' ' +
    objectByString(data, 'QuestionEvent.Name');
  var parameters = '';
  var numParams = Math.min(data['QuestionParameters'].length, 3);
  for (var i = 0; i < numParams; i++) {
    parameters += data['QuestionParameters'][i]['concept_cd'];
    parameters += (i !== numParams - 1)
      ? ', '
      : (numParams < data['QuestionParameters'].length) ? ' . . .' : '';
  }
  var status = objectByString(data, 'QuestionStatus.Status');
  return ([
    <td key={1} >{question}</td>,
    <td key={2} >{parameters}</td>,
    <td key={3} >{status}</td>
  ]);
};

// Helper to create well with extra information on submitted questions
const HiddenRow = React.createClass({

  handleCopy() {
    // Insert question into local storage
    // Load user dashboard
    // Load up question creator
  },

  // Render well
  render() {
    var { data, ...props } = this.props;

    // Get Question realted info
    var question = objectByString(data, 'QuestionType.Type') + ' ' +
      objectByString(data, 'QuestionEvent.Name');
    var paramsLong = '';
    var paramsShort = '';
    var numParams = data['QuestionParameters'].length;
    for (var i = 0; i < numParams; i++) {
      paramsLong += data['QuestionParameters'][i]['concept_cd'];
      paramsLong += (i !== numParams - 1) ? ', ' : '';
      if (i < 3) {
        paramsShort += data['QuestionParameters'][i]['concept_cd'];
        paramsShort += (i !== 2 && i !== numParams - 1) ? ', ' : '';
        if (i === 2 && numParams > 3) {
          paramsShort += ' . . .';
        }
      }
    }

    // Get AI related info
    var status = objectByString(data, 'QuestionStatus.Status');
    var classifier = '';
    var accuracy = '';
    var hasFeedback = data.StatusID === 3;
    if (data.AIModels.length > 0) {
      var aiModel = data.AIModels[0];
      classifier = aiModel.Algorithm;
      accuracy = aiModel.Accuracy;
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
            </dl>
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={6} smOffset={6} mdOffset={6}>
            <Button className='pull-right' bsSize="xsmall" bsStyle="danger" onClick={this.handleCopy}>
              Copy Question
            </Button>
          </Col>
        </Row>
      </Well>
    );
  }
});
