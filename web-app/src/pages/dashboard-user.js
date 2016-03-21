import React from 'react';
import { Grid } from 'react-bootstrap';
import QuestionCreator from '../partials/question-creator.js';
import NemoTable from '../partials/nemo-table.js';
import Alert from '../partials/alert';

import config from 'clientconfig';
import io from 'socket.io-client';
const dash = io.connect(config.apiUrl + '/dash');

import { objectByString } from '../util';

var refresh = null;

// User Dashboard page uses partials question-creator and nemo-table
export default React.createClass({

  fetchTableData() {
    dash.emit('getUser', localStorage.userID, {}, (err, data) => {
      var rows = [];

      data = JSON.parse(data);
      data.forEach((d) => {
        var row = [];

        var question = objectByString(d, 'QuestionType.Type') + ' ' +
          objectByString(d, 'QuestionEvent.Name');
        var parameters = '';
        var numParams = Math.min(d['QuestionParameters'].length, 3);
        for (var i = 0; i < numParams; i++) {
          parameters += d['QuestionParameters'][i]['concept_cd'];
          parameters += (i !== numParams - 1)
            ? ', '
            : (numParams < d['QuestionParameters'].length) ? ' . . .' : '';
        }
        var status = objectByString(d, 'QuestionStatus.Status');

        row.push(question);
        row.push(parameters);
        row.push(status);

        rows.push(row);
      });
      if (!err) {
        this.setState({
          data: data,
          rows: rows
        });
      } else {
        Alert('Error Fetching Questions', 'danger', 4 * 1000);
      }
    });
  },

  componentWillUnmount() {
    clearInterval(refresh);
  },

  // Once page is mounted attach page title
  componentDidMount() {
    document.title = 'Nemo User Dashboard';
    this.fetchTableData();

    if (refresh === null) {
      refresh = window.setInterval(this.fetchTableData, 1000 * 30);
    }
  },

  getInitialState() {
    return {
      data: [],
      rows: [],
      refresh: null
    };
  },

  // Render user dashboard page
  render() {
    return (
      <Grid>
        <h2>Create a question</h2>
        <QuestionCreator onClick={this.fetchTableData}/>

        <h2>Your Questions</h2>
        <NemoTable
          data={this.state.data}
          rows={this.state.rows}
          onClick={this.fetchTableData} />
      </Grid>
    );
  }
});
