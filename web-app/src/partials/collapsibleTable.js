import React, { PropTypes } from 'react'
import { Collapse, Table } from 'react-bootstrap'

// Helper to create table headers
class Thead extends React.Component {
  render () {
    return (
      <thead>
        <tr>
          {this.props.headers()}
        </tr>
      </thead>
    )
  }
}

Thead.propTypes = {
  headers: PropTypes.func
}

// Helper to create table rows
class Tbody extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      open: []
    }

    this.closeAll = this.closeAll.bind(this)
  }

  closeAll () {
    var closed = new Array(this.state.open.length)

    for (var i = 0; i < closed.length; i++) {
      closed[i] = false
    }

    this.setState({
      open: closed
    })
  }

  // Render table body
  render () {
    return (
      <tbody>
        {/* Map each 'row' to a minimal and hidden row */}
        {this.props.data.map((datum, i) => {

          if (this.state.open[i] === undefined) {
            this.state.open[i] = false
          }

          {/* Helper to create minimal row */}
          const minimalRow =
            <tr
              key={i}
              className='custom-hover'
              onClick={() => {
                var state = this.state.open
                state[i] = !this.state.open[i]
                this.setState({ open: state })
              }}>
              {this.props.minimalRow(datum)}
            </tr>

          {/* Helper to create hidden row */}
          const hiddenRow =
            <tr>
              <td colSpan={this.props.numCols} className={this.state.open[i] ? '' : 'hidden'}>
                <Collapse in={this.state.open[i]} collapsibleTableCloseAll={this.closeAll}>
                  <this.props.hiddenRow
                    data={datum} />
                </Collapse>
              </td>
            </tr>

          {/* Render rows */}
          return ([
            minimalRow,
            hiddenRow
          ])
        })}
      </tbody>
    )
  }
}

Tbody.propTypes = {
  data: PropTypes.array,
  numCols: PropTypes.number,
  minimalRow: PropTypes.func,
  hiddenRow: PropTypes.func
}

class CollapsibleTable extends React.Component {
  render () {
    return (
      <Table responsive condensed>
        <Thead headers={this.props.headers} />
        <Tbody
          data={this.props.data}
          numCols={this.props.numCols}
          minimalRow={this.props.minimalRow}
          hiddenRow={this.props.hiddenRow} />
      </Table>
    )
  }
}

CollapsibleTable.propTypes = {
  data: PropTypes.array,
  numCols: PropTypes.number,
  headers: PropTypes.func,
  minimalRow: PropTypes.func,
  hiddenRow: PropTypes.func
}

CollapsibleTable.defaultProps = {
  data: [],
  numCols: 0,
  headers: () => {},
  minimalRow: () => {},
  hiddenRow: undefined
}

export default CollapsibleTable
