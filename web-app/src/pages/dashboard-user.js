import React from 'react';

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

    // Test addition/removal of rows
    // var self = this;
    // function TEST() {
    //   console.log('update');
    //   if (Math.random() < 0.7 || TEST_ROWS.length < 3) {
    //     TEST_ROWS.push(['Q' + Math.random(), 'A' + Math.random()]);
    //   } else {
    //     TEST_ROWS.pop();
    //   }
    //
    //   self.setState({
    //     rows: TEST_ROWS
    //   });
    // }

    // UPDATE = setInterval(TEST, 1000);
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
      <div className='container'>
        <h2>Create a question</h2>
        <QuestionCreator />

        <h2>Your Questions</h2>
        <NemoTable rows={this.state.rows} headers={this.state.headers} />
      </div>
    );
  }
});
