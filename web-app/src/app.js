import domReady from 'domready';
import setFavicon from 'favicon-setter';
import { render } from 'react-dom';
import { router} from './router';

// Start once dom has loaded
domReady(() => {

  // Create app container
  var app = document.createElement('div');
  app.id = 'app';
  app = document.body.appendChild(app);

  // Set fav icon
  setFavicon('/favicon.ico');

  // Render app
  render(
    router,
    app
  );

});
