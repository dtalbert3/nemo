import React from 'react';
import { Grid } from 'react-bootstrap';
import QuestionCreator from '../partials/question-creator.js';
import NemoTable from '../partials/nemo-table.js';

// User Dashboard page uses partials question-creator and nemo-table
export default React.createClass({

  // Once page is mounted attach page title
  componentDidMount() {
    document.title = 'Nemo User Dashboard';
  },

  // Render user dashboard page
  render() {
    return (
      <Grid>
        <h2>Create a question</h2>
        <QuestionCreator />

        <h2>Your Questions</h2>
        <NemoTable />
      </Grid>
    );
  }
});
