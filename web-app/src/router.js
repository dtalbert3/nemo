import React from 'react';
import { Router, Route , browserHistory } from 'react-router';
import Base from './pages/base';
import Login from './pages/login';
import DashboardUser from './pages/dashboard-user';
// import DashboardGlobal from './pages/dashboard-global';
import FourOhFour from './pages/404';

/* Create specified routes for apps
  Base
  |--Login Page
  |--User Page
  |--Global Page
  404 Page
*/
const routes = (
  <Route>
    <Route path='/' component={Base}>
      <Route path='/login' component={Login} />
      <Route path='/user' component={DashboardUser} />
      {/* <Route path='/global' component={DashboardGlobal} /> */}
    </Route>
    <Route path='/*' component={FourOhFour} />
  </Route>

);

// Handles app's page navigation
export const router = (
  <Router routes={routes} history={browserHistory}/>
);
