import React from 'react';
import { Collapse, Well, Table } from 'react-bootstrap';
import Alert from './alert';

import config from 'clientconfig';
import io from 'socket.io-client';
const dash = io.connect(config.apiUrl + '/dash');

import { objectByString } from '../util';

// Helper to create table headers
const Thead = React.createClass({

  // Render table headers
  render() {
    return (
      <thead>
        <tr>
          {this.props.headers.map((head, i) => {
            return <td key={i}><h4>{head}</h4></td>;
          })}
        </tr>
      </thead>
    );
  }
});

// Helper to create table rows
const Tbody = React.createClass({

  // Create initial mapping of hidden rows
  getInitialState() {
    return { open: [] };
  },

  // Render table body
  render() {
    return (
      <tbody>
        {/* Map each 'row' to a minimal and hidden row */}
        {this.props.minimalRowsDom.map((undefined, i) => {

          if (this.state.open[i] === undefined) {
            this.state.open[i] = false;
          }

          // Surround minimal row dom in tr
          const minimalRow = (
            <tr
              key={this.props.minimalRowsDom[i].id}
              className='custom-hover'
              onClick={() => {
                var state = this.state.open;
                state[i] = !this.state.open[i];
                this.setState({ open: state }); }
              }>
              {this.props.minimalRowsDom[i]}
            </tr>
          );

          // Surround hidden row dom in tr
          const hiddenRow = (
            <tr key={this.props.hiddenRowsDom[i].id} className={this.state.open[i] ? '' : 'hidden'}>
              <td colSpan={this.props.colCount}>
                <Collapse in={ this.state.open[i] }>
                  {this.props.hiddenRowsDom[i]}
                </Collapse>
              </td>
            </tr>
          );

          // Render rows
          return ([
            minimalRow,
            hiddenRow
          ]);
        })}
      </tbody>
    );
  }
});

// Create table to display questions within the nemo data mart
export default React.createClass({

  // Once page is mounted fetch table data
  componentDidMount() {
    dash.emit('getUser', localStorage.userID, {}, (err, data) => {
      if (!err) {
        var minimalRowsDom = [];
        var hiddenRowsDom = [];
        console.log(data);
        data.forEach((d) => {

          // Get information to be used for minimal row
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

          // Create minimal row
          var minimalRow = ([
            <td key={1}>{question}</td>,
            <td key={2}>{parameters}</td>,
            <td key={3}>{status}</td>
          ]);

          var hiddenRow = (
            <Well bsSize='large'>
              <h2> Hello </h2>
            </Well>
          );

          minimalRowsDom.push(minimalRow);
          hiddenRowsDom.push(hiddenRow);
        });

        this.setState({
          rowCount: data.length,
          minimalRowsDom: minimalRowsDom,
          hiddenRowsDom: hiddenRowsDom
        });
      } else {
        Alert('Error Fetching Questions', 'danger', 4 * 1000);
      }
    });

  },

  // Initialize headers and rows to empty
  getInitialState() {
    return {
      rowCount: 0,
      colCount: 3,
      headers: [
        'Question',
        'Parameters',
        'Status'
      ],
      minimalRowsDom: [],
      hiddenRowsDom: []
    };
  },

  // Render question table
  render() {
    return (
      <Table responsive condensed>
        <Thead headers={this.state.headers} />
        <Tbody
          rowCount={this.state.rowCount}
          colCount={this.state.colCount}
          minimalRowsDom={this.state.minimalRowsDom}
          hiddenRowsDom={this.state.hiddenRowsDom}
          data={this.state.data} />
      </Table>
    );
  }
});
