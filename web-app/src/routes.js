import React from 'react'
import { Router, Route } from 'react-router'

import Base from './layouts/BaseLayout'
import Login from './views/login'
import Signup from './views/signup'
import ForgotPassword from './views/forgotPassword'
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
  var path = nextState.location.pathname
  if (path === '/') {
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

const logout = (nextState, replace) => {
  Auth.logout()
  replace({
    pathname: '/login',
    state: { nextPathname: nextState.location.pathname }
  })
}

export default () => (
  <Router>
    <Route path='/' component={Base} onEnter={defaultPage} >
      <Route path='/login' component={Login} />
      <Route path='/logout' onEnter={logout} />
      <Route path='/signup' component={Signup} />
      <Route path='/forgotPassword' component={ForgotPassword} />
      <Route path='/user' component={DashboardUser} onEnter={requireAuth} />
      <Route path='/global' component={DashboardGlobal} onEnter={requireAuth} />
      <Route path='/about' component={About} />
    </Route>
    <Route path='/*' component={FourOhFour} />
  </Router>
)
