import React from 'react';

import { Collapse, Well, Table } from 'react-bootstrap';

const Tbody = React.createClass({
  getInitialState: function() {
    return { open: [] };
  },

  render() {
    var self = this;
    return (
      <tbody>
        {self.props.rows.map(function(row, i) {
          if (self.state.open[i] === undefined) {
            self.state.open[i] = false;
          }
          return (
            [<tr
              key={i}
              className='custom-hover'
              onClick={ ()=> {
                var state = self.state.open;
                state[i] = !self.state.open[i];
                self.setState({ open: state });
              }}>
              {row.map(function(col, j) {
                return <td key={j}>{col}</td>;
              })}
            </tr>,
            <tr>
              <td colSpan={row.length} className={ self.state.open[i] ? '' : 'hidden' }>
              <Collapse in={ self.state.open[i] }>
                <div>
                  <Well bsSize='large'>
                    <h1>Hidden Content</h1>
                  </Well>
                </div>
              </Collapse>
              </td>
            </tr>]
          );
        })}
      </tbody>
  );
  }
});

const Thead = React.createClass({
  render() {
    return (
      <thead>
        <tr>
          {this.props.headers.map(function(head, i) {
            return <td key={i}><h4>{head}</h4></td>;
          })}
        </tr>
      </thead>
    );
  }
});

export default React.createClass({
  render() {
    return (
      <Table responsive condensed>
        <Thead headers={this.props.headers} />
        <Tbody rows={this.props.rows} />
      </Table>
    );
  }
});
