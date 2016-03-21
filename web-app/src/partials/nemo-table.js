import React from 'react';
import { Collapse, Well, Table, Row, Col, Button } from 'react-bootstrap';
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
        {this.props.rows.map((row, i) => {

          if (this.state.open[i] === undefined) {
            this.state.open[i] = false;
          }

          {/* Helper to create minimal row */}
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

          {/* Helper to create hidden row */}
          const hiddenRow =
            <tr>
              <td colSpan={row.length} className={this.state.open[i] ? '' : 'hidden'}>
                <InfoWell
                  open={this.state.open[i]}
                  data={this.props.data[i]}
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

  handleDelete() {
    dash.emit('delete', this.props.data.ID, (err) => {
      if (err) {
        Alert('Error Deleting Questions', 'success', 4 * 1000);
      } else {
        Alert('Question Deleted', 'danger', 4 * 1000);
      }
    });
  },

  handleFeedback() {
    var yes = this.refs.yes.checked;
    var no = this.refs.no.checked;
    alert(no);
    alert(yes);
  },

  // Render well
  render() {
    var { data, open, ...props } = this.props;

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
      <Collapse in={ open }>
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
      </Collapse>
    );
  }
});

// Create table to display questions within the nemo data mart
export default React.createClass({

  // Once page is mounted fetch table data
  componentDidMount() {
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

  // Initialize headers and rows to empty
  getInitialState() {
    return {
      data: [],
      headers: [
        'Question',
        'Parameters',
        'Status'
      ],
      rows: []
    };
  },

  // Render question table
  render() {
    return (
      <Table responsive condensed>
        <Thead headers={this.state.headers} />
        <Tbody
          rows={this.state.rows}
          data={this.state.data} />
      </Table>
    );
  }
});
