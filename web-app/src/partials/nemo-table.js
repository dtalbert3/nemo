import React from 'react';

import { Collapse, Well, Table } from 'react-bootstrap';

const Tbody = React.createClass({
  getInitialState() {
    return { open: [] };
  },

  render() {
    return (
      <tbody>
        {this.props.rows.map((row, i) => {
          if (this.state.open[i] === undefined) {
            this.state.open[i] = false;
          }
          return (
            [<tr
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
            </tr>,
            <tr>
              <td colSpan={row.length} className={ this.state.open[i] ? '' : 'hidden' }>
              <Collapse in={ this.state.open[i] }>
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
          {this.props.headers.map((head, i) => {
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
