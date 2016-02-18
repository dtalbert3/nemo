import React from 'react';
import ReactDom from 'react-dom';
import { Alert } from 'react-bootstrap';

export default function(message = '', style = 'info', timer = 0) {
  var alert = document.createElement('div');
  alert = document.getElementById('alert').appendChild(alert);

  const dismiss = () => {
    document.getElementById('alert').removeChild(alert);
    clearTimeout(timeout);
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

  var timeout;
  if (timer > 0) {
    timeout = setTimeout(dismiss, timer);
  }
}
