import React from 'react';

import { Grid } from 'react-bootstrap';

import QuestionCreator from '../partials/question-creator.js';
import NemoTable from '../partials/nemo-table.js';

var TEST_HEADERS = [
  'Question',
  'AI'
];

var TEST_ROWS = [
  ['Q1', 'A1'],
  ['Q2', 'A2']
];

// var UPDATE;

export default React.createClass({
  componentDidMount() {
    document.title = 'Nemo User Dashboard';
  },

  componentWillUnmount() {
    // clearInterval(UPDATE);
  },

  getInitialState() {
    return {
      headers: TEST_HEADERS,
      rows: TEST_ROWS
    };
  },

  render() {
    return (
      <Grid>
        <h2>Create a question</h2>
        <QuestionCreator />

        <h2>Your Questions</h2>
        <NemoTable rows={this.state.rows} headers={this.state.headers} />
      </Grid>
    );
  }
});
