import domReady from 'domready';
// import config from 'clientconfig';
import setFavicon from 'favicon-setter';
import { render } from 'react-dom';
import { router} from './router';

// Start once dom has loaded
domReady(function() {

  // Create app container
  var app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);

  // Set fav icon
  setFavicon('/favicon.png');

  // Render app
  render(
    router,
    document.getElementById('app')
  );

});
