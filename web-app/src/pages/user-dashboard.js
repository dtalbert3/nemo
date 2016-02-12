import React from 'react';

export default React.createClass({
  componentDidMount: function() {
    document.title = 'Nemo User Dashboard';
  },
  render() {
    return (
      <p>Hello World</p>
    );
  }
});
