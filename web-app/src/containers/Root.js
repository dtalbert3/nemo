import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

export default React.createClass({
  render() {
    return (
      <Provider store={this.props.store}>
        <Router history={this.props.history}>
          {this.props.routes}
        </Router>
      </Provider>
    );
  }
});
