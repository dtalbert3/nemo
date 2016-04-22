import React from 'react'
import { Router, Route } from 'react-router'

import Base from './layouts/BaseLayout'
import Login from './views/login'
import Signup from './views/signup'
import DashboardUser from './views/dashboardUser'
import DashboardGlobal from './views/dashboardGlobal'
import About from './views/about'
import FourOhFour from './views/404'

import Auth from './auth'

const requireAuth = (nextState, replace) => {
  if (!Auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

const defaultPage = (nextState, replace) => {
  console.log(nextState.location.pathname)
  if (nextState.location.pathname === '/') {
    if (!Auth.loggedIn()) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      })
    } else {
      replace({
        pathname: '/user',
        state: { nextPathname: nextState.location.pathname }
      })
    }
  }
}

export default () => (
  <Router>
    <Route path='/' component={Base} onEnter={defaultPage} >
      <Route path='/login' component={Login} />
      <Route path='/signup' component={Signup} />
      {/* <Route path='/forgotPassword' component={}> */}
      <Route path='/user' component={DashboardUser} onEnter={requireAuth} />
      <Route path='/global' component={DashboardGlobal} onEnter={requireAuth} />
      <Route path='/about' component={About} />
    </Route>
    <Route path='/*' component={FourOhFour} />
  </Router>
)
