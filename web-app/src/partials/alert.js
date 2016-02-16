import React from 'react';
import ReactDom from 'react-dom';
import { Alert } from 'react-bootstrap';

export default function(message = '', style = 'info', timeout = -1) {
  var alert = document.createElement('div');
  alert = document.getElementById('alert').appendChild(alert);

  const dismiss = () => {
    document.getElementById('alert').removeChild(alert);
  };

  const AlertPopup = (message, style) => {
    return (
      <Alert role='alert' bsStyle={style} onDismiss={dismiss}>
        <p> {message} </p>
      </Alert>
    );
  };

  ReactDom.render(
    AlertPopup(message, style),
    alert
  );

  if (timeout > 0) {
    setTimeout(dismiss, timeout);
  }
}
