import React from 'react';
import { Router, Route , browserHistory } from 'react-router';
import Base from './pages/base';
import Login from './pages/login';
import DashboardUser from './pages/dashboard-user';
// import DashboardGlobal from './pages/dashboard-global';
// import About from './pages/about';
import FourOhFour from './pages/404';

import Auth from './auth';

/* Create specified routes for apps
  Base
  |--Login Page
  |--User Page
  |--Global Page
  404 Page
*/

function requireAuth(nextState, replace) {
  if (!Auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}

function defaultPage(nextState, replace) {
  console.log(nextState.location.pathname);
  if (nextState.location.pathname === '/') {
    if (!Auth.loggedIn()) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    } else {
      replace({
        pathname: '/user',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  }
}

const routes = (
  <Route>
    <Route path='/' component={Base} onEnter={defaultPage} >
      <Route path='/login' component={Login} />
      <Route path='/user' component={DashboardUser} onEnter={requireAuth} />
      {/* <Route path='/global' component={DashboardGlobal} onEnter={requireAuth} /> */}
      {/* <Route path='/about' component={About} /> */}
    </Route>
    <Route path='/*' component={FourOhFour} />
  </Route>
);

// Handles app's page navigation
export const router = (
  <Router routes={routes} history={browserHistory}/>
);
