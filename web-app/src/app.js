import React from 'react';
import ReactDOM from 'react-dom';
import domReady from 'domready';
import setFavicon from 'favicon-setter';

import Root from './containers/Root';
import { createStore } from 'redux';
import reducers from './redux/rootReducer';
import makeRoutes from './routes';
import { browserHistory } from 'react-router';

import api from './api';

// Start app once dom has loaded using specified router
domReady(() => {

  // Create app attach point
  var app = document.createElement('div');
  app.id = 'app';
  app = document.body.appendChild(app);

  document.title = 'Nemo';

  // Set fav icon
  setFavicon('/favicon.ico');

  // Create store
  const store = createStore(reducers, {});

  // Create routes
  const routes = makeRoutes(store);

  // Set store for api
  api.setStore(store);

  // Render app
  ReactDOM.render(
    <Root store={store} routes={routes} history={browserHistory}/>, app);
});
