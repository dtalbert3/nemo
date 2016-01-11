var PageView = require('./base');
var templates = require('../templates');

module.exports = PageView.extend({
  pageTitle: 'Login',
  template: templates.pages.login
});
