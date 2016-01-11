// This app view is responsible for rendering all content that goes into
// <html>. It's initted right away and renders iteslf on DOM ready.

// This view also handles all the 'document' level events such as keyboard shortcuts.
var app = require('ampersand-app');
var View = require('ampersand-view');
var ViewSwitcher = require('ampersand-view-switcher');
var domify = require('domify');
var dom = require('ampersand-dom');
var localLinks = require('local-links');
var _ = require('lodash');
var setFavicon = require('favicon-setter');

var templates = require('../templates');

module.exports = View.extend({
  template: templates.body,
  initialize: function () {
    // this marks the correct nav item selected
    app.router.history.on('route', this.updateActiveNav, this);
  },
  events: {
    'click a[href]': 'handleLinkClick'
  },
  render: function () {
    // some additional stuff we want to add to the document head
    document.head.appendChild(domify(templates.head()));

    // main renderer
    this.renderWithTemplate();

    // init and configure our page switcher
    this.pageSwitcher = new ViewSwitcher(this.queryByHook(
      'page-container'), {
      show: function (newView) {
        // it's inserted and rendered for me
        document.title = _.result(newView, 'pageTitle') || 'NEMO';
        document.scrollTop = 0;
        // add a class specifying it's active
        newView.el.classList.add('active');

        // store an additional reference, just because
        app.currentPage = newView;
      }
    });

    // setting a favicon for fun (note, it's dyanamic)
    setFavicon('/favicon.png');
    return this;
  },

  setPage: function (view) {
    // tell the view switcher to render the new one
    this.pageSwitcher.set(view);

    // mark the correct nav item selected
    this.updateActiveNav();
  },

  handleLinkClick: function (e) {
    // if the window location host and target host are the
    // same it's local, else, leave it alone
    var localPath = localLinks.pathname(e);
    if (localPath) {
      e.preventDefault();
      app.navigate(localPath);
    }
  },

  updateActiveNav: function () {
    var path = window.location.pathname.slice(1);

    this.queryAll('.nav a[href]').forEach(function (aTag) {
      var aPath = aTag.pathname.slice(1);

      if ((!aPath && !path) || (aPath && path.indexOf(aPath) === 0)) {
        dom.addClass(aTag.parentNode, 'active');
      } else {
        dom.removeClass(aTag.parentNode, 'active');
      }
    });
  }
});
