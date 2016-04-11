import React from 'react';
import { connect } from 'react-redux';
import { Well, Button, Grid, Col, Row } from 'react-bootstrap';
import QuestionCreator from '../partials/questionCreator.js';
import CollapsibleTable from '../partials/collapsibleTable.js';
import Alert from '../partials/alert';

import api from '../api';
import config from '../config';
import { objectByString } from '../util';

var refresh = null;

// User Dashboard page uses partials question-creator and nemo-table
const UserDashboard = React.createClass({

  updateUserQuestions() {
    api.fetchUserData();
  },

  handleSubmitQuestion(question) {
    api.addQuestion(question)
      .then(() => {
        this.updateUserQuestions();
      });
  },

  componentWillUnmount() {
    clearInterval(refresh);
  },

  // Once page is mounted attach page title
  componentDidMount() {
    document.title = 'Nemo User Dashboard';

    var loadAlert = Alert('Loading Question Creator', 'info');

    var loadedTypes = false;
    var loadedEvents = false;
    var loadedSuggestions = false;

    // Fetch user questions
    api.fetchUserData()

    // Set periodic refresh of questions
    if (refresh === null) {
      refresh = window.setInterval(this.updateUserQuestions, config.UserDashRefreshRate);
    }

    // Fetch properites for question creator
    api.getTypes()
      .then(() => {
        loadedTypes = true;
      });
    api.getEvents()
      .then(() => {
        loadedEvents = true;
      });
    api.getSuggestions()
      .then(() => {
        loadedSuggestions = true;
        this.refs.QuestionCreator.updateTypeAhead();
      });

    // Tell user when question creator has been loaded
    var intervalID = window.setInterval(() => {
      if (loadedTypes && loadedEvents && loadedSuggestions) {
        document.getElementById('alert').removeChild(loadAlert);
        clearInterval(intervalID);
      }
    }, 1000);
  },

  getDefaultProps: function() {
    return {
      questions: [],
      questionTypes: [],
      questionEvents: [],
      suggestions: [],
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
        <h2>Create a question</h2>
        <QuestionCreator
          ref='QuestionCreator'
          onClick={this.updateUserQuestions}
          questionTypes={this.props.questionTypes}
          questionEvents={this.props.questionEvents}
          suggestions={this.props.suggestions}
          handleSubmit={this.handleSubmitQuestion} />

        <h2>Your Questions</h2>
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

const mapStateToProps = (state, props) => ({
  questions: state.nemoQuestions.userQuestions,
  questionTypes: state.questionCreator.questionTypes,
  questionEvents: state.questionCreator.questionEvents,
  suggestions: state.questionCreator.suggestions
});

export default connect((mapStateToProps), {})(UserDashboard);

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
  ])
}

// Helper to create well with extra information on submitted questions
const HiddenRow = React.createClass({

  handleDelete() {
    api.deleteQuestion(this.props.data.ID)
      .then(() => {
        api.fetchUserData();
      });
  },

  handleFeedback() {
    var yes = this.refs.yes.checked;
    var no = this.refs.no.checked;
    var id = this.props.data.AIModels[0].ID;
    if (yes || no) {
      var params = {};
      params.aiModelID = id;
      if (yes) {
        params.value = 1;
      } else {
        params.value = 0;
      }
      api.giveFeedback(params);
    }
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
          <Col sm={12} md={12}>
            {(hasFeedback) ?
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
            {(hasFeedback) ?
              <Button className='pull-left' bsSize="xsmall" bsStyle="primary" onClick={this.handleFeedback}>
                Submit Feedback
              </Button>
            : undefined}
          </Col>
          <Col sm={6} md={6}>
            <Button className='pull-right' bsSize="xsmall" bsStyle="danger" onClick={this.handleDelete}>
              Delete
            </Button>
          </Col>
        </Row>
      </Well>
    );
  }
});
