import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import { createStore } from 'redux'

import './styles/main.styl'
import 'static?!./favicon.ico?output=favicon.ico'
import Root from './containers/Root'
import reducers from './redux/rootReducer'
import makeRoutes from './routes'
import api from './api'

// Create store
const store = createStore(reducers, {})

// Create routes
const routes = makeRoutes(store)

// Set store for api
api.setStore(store)

// Go ahead and fetch these as they don't require any auth or have to be fetched again
api.getTypes()
api.getEvents()
api.getSuggestions()

// Render app
ReactDOM.render(
  <Root store={store} routes={routes} history={browserHistory}/>,
  document.getElementById('root')
)
