import React from 'react';
import ReactDom from 'react-dom';
import { Alert } from 'react-bootstrap';

// Creates alert for web app
export default function(message = '', style = 'info', timer = 0) {

  // Point to attach alerts to
  var alert = document.createElement('div');
  alert.style.cssText = 'position:relative;';
  alert = document.getElementById('alert').appendChild(alert);

  // Destroy alert
  const dismiss = () => {
    document.getElementById('alert').removeChild(alert);
    clearTimeout(timeout);
  };

  // Create alert
  // For style options see (http://getbootstrap.com/components/#alerts)
  const AlertPopup = (message, style) => {
    var absolute = {
      position: 'absolute',
      zIndex: 999,
      top: 8,
      left: 0,
      right: 0
    };
    return (
      <Alert role='alert' style={absolute} bsStyle={style} onDismiss={dismiss}>
        <p> {message} </p>
      </Alert>
    );
  };

  // Render alert
  ReactDom.render(
    AlertPopup(message, style),
    alert
  );

  // Set timeout to destroy alert if timer passed
  var timeout;
  if (timer > 0) {
    timeout = setTimeout(dismiss, timer);
  }

  return alert;
}
