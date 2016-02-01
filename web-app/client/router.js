var Router = require('ampersand-router');
var LoginPage = require('./pages/login');
var UserDashboardPage = require('./pages/user-dashboard');
var GlobalDashboardPage = require('./pages/global-dashboard');
var SettingsPage = require('./pages/settings');

module.exports = Router.extend({
  routes: {
    'login/': 'login',
    'user/': 'user',
    'global/:id': 'global',
    'settings/': 'settings',
    '(*path)': 'catchAll'
  },

  // ------- ROUTE HANDLERS ---------
  login: function () {
    this.trigger('newPage', new LoginPage({
      // Pass page parameters here
      // Deal with id/query strings here
    }));
  },

  user: function () {
    this.trigger('newPage', new UserDashboardPage({
      // Pass page parameters here
      // Deal with id/query strings here
    }));
  },

  global: function () {
    this.trigger('newPage', new GlobalDashboardPage({
      // Pass page parameters here
      // Deal with id/query strings here
    }));
  },

  settings: function () {
    this.trigger('newPage', new SettingsPage({
      // Pass page parameters here
      // Deal with id/query strings here
    }));
  },

  catchAll: function () {
    this.redirectTo('login/');
  }
});
