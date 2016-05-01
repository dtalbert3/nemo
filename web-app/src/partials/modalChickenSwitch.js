import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Table, Well, ButtonGroup, Button, DropdownButton,
  Grid, Col, Row, MenuItem, Modal }
  from 'react-bootstrap'

// Modal window for a chicken switch
class ModalChickenSwitch extends React.Component {

  constructor(props){
    super(props)

    var data = this.props.data
    this.state = {}

    this.close = this.close.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.apiCall = this.props.apiCall.bind(this)
  }

  close () {
    // Dirty trick to prevent error logs
    // Hopefully fixed in future versions of React
    setTimeout(()=> {
      ReactDOM.unmountComponentAtNode(this.props.mountPoint)
    }, 100);
  }

  handleSubmit () {
      this.apiCall(this.props.apiCallParams).then((msg) => {
        Alert(msg, 'success', 4 * 1000)
        this.close()
      })
      .catch((err) => {
        Alert(err, 'danger', 4 * 1000)
      })
  }

  render() {
    return (
      <Modal ref='Modal' id='Modal' show>
        <Modal.Header>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className='form-horizontal'>
            Are you sure?
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button className='pull-left' onClick={this.handleSubmit} bsStyle='primary'>Submit</Button>
          <Button onClick={this.close}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ModalChickenSwitch.defaultProps = {}


export default ModalChickenSwitch