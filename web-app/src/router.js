import React from 'react';
import { Router, Route , browserHistory} from 'react-router';

import Base from './pages/base';
import Login from './pages/login';
import UserDashboard from './pages/user-dashboard';
import FourOhFour from './pages/404';

const routes = (
  <Route>
    <Route path='/' component={Base}>
      <Route path='/login' component={Login} />
      <Route path='/user' component={UserDashboard} />
    </Route>
    <Route path='/*' component={FourOhFour} />
  </Route>

);

export const router = (
  <Router routes={routes} history={browserHistory}/>
);
