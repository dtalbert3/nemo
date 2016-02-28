import React from 'react';
import { Collapse, Well, Table } from 'react-bootstrap';
import Alert from './alert';

// import config from 'clientconfig';
import io from 'socket.io-client';
// const socket = io(config.apiUrl); // Required for production
const socket = io(); // Defaults to localhost
// Test headers until API call integrated
var TEST_HEADERS = [
  'Question',
  'AI'
];

// Test rows until API call integrated
var TEST_ROWS = [
  ['Q1', 'A1'],
  ['Q2', 'A2']
];

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
        {this.props.rows.map((row, i) => {

          if (this.state.open[i] === undefined) {
            this.state.open[i] = false;
          }

          {/* Create minimal row */}
          const minimalRow =
            <tr
              key={i}
              className='custom-hover'
              onClick={() => {
                var state = this.state.open;
                state[i] = !this.state.open[i];
                this.setState({ open: state });
              }}>
              {row.map((col, j) => {
                return <td key={j}>{col}</td>;
              })}
            </tr>;

          {/* Create hidden row */}
          const hiddenRow =
            <tr>
              <td colSpan={row.length} className={this.state.open[i] ? '' : 'hidden'}>
                <InfoWell
                  open={this.state.open[i]}
                  data={row}
                />
              </td>
            </tr>;

          {/* Render rows */}
          return ([
            minimalRow,
            hiddenRow
          ]);
        })}
      </tbody>
    );
  }
});

// Helper to create well with extra information on submitted questions
const InfoWell = React.createClass({

  // Render well
  render() {
    var { data, open, ...props } = this.props;
    return (
      <Collapse in={ open }>
        <Well bsSize='large'>
          <h1>Hidden Content</h1>
        </Well>
      </Collapse>
    );
  }
});

// Create table to display questions within the nemo data mart
export default React.createClass({

  // Once page is mounted fetch table data
  componentDidMount() {
    socket.emit('dashboard::get', 1, {}, (err, data) => {
      console.log(data);
      if (!err) {
        this.setState({
          headers: TEST_HEADERS,
          rows: TEST_ROWS
        });
      } else {
        Alert('Error Fetching Questions', 'danger', 4 * 1000);
      }
    });

  },

  // Initialize headers and rows to empty
  getInitialState() {
    return {
      headers: [],
      rows: []
    };
  },

  // Render question table
  render() {
    return (
      <Table responsive condensed>
        <Thead headers={this.state.headers} />
        <Tbody rows={this.state.rows} />
      </Table>
    );
  }
});
