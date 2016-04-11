import React from 'react';
import { Collapse, Table } from 'react-bootstrap';

// Helper to create table headers
const Thead = React.createClass({
  render() {
    return (
      <thead>
        <tr>
          {this.props.headers()}
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

  closeAll() {
    var closed = new Array(this.state.open.length);
    for (var i = 0; i < closed.length; i++) {
      closed[i] = false;
    }
    this.setState({
      open: closed
    });
  },

  // Render table body
  render() {
    return (
      <tbody>
        {/* Map each 'row' to a minimal and hidden row */}
        {this.props.data.map((datum, i) => {

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
              {this.props.minimalRow(datum)}
            </tr>;

          {/* Helper to create hidden row */}
          const hiddenRow =
            <tr>
              <td colSpan={this.props.numCols} className={this.state.open[i] ? '' : 'hidden'}>
                <Collapse in={this.state.open[i]}>
                  <this.props.hiddenRow
                    data={datum} />
                </Collapse>
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

// Create table to display questions within the nemo data mart
export default React.createClass({
  render() {
    return (
      <Table responsive condensed>
        <Thead headers={this.props.headers} />
        <Tbody
          data={this.props.data}
          numCols={this.props.numCols}
          minimalRow={this.props.minimalRow}
          hiddenRow={this.props.hiddenRow} />
      </Table>
    );
  }
});
