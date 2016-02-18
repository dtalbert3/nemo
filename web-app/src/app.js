import domReady from 'domready';
import setFavicon from 'favicon-setter';
import { render } from 'react-dom';
import { router} from './router';

// Start app once dom has loaded using specified router
domReady(() => {

  // Create app attach point
  var app = document.createElement('div');
  app.id = 'app';
  app = document.body.appendChild(app);

  // Set fav icon
  setFavicon('/favicon.ico');

  // Render app
  render(router, app);
});
