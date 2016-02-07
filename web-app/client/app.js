var app = require('ampersand-app');
var domReady = require('domready');
// var logger = require('andlog');
// var config = require('clientconfig');

var Router = require('./router');
var MainView = require('./views/main');

// Attach app to window for easy access
window.app = app;

app.extend({
  router: new Router(),
  patients: {},
  init: function () {
    // wait for document ready to render our main view
    // this ensures the document has a body, etc.
    // init our main view
    var mainView = new MainView({
      el: document.body
    });

    // ...and render it
    mainView.render();

    // listen for new pages from the router
    this.router.on('newPage', mainView.setPage, mainView);

    // we have what we need, we can now start our router and show the appropriate page
    this.router.history.start({
      pushState: true,
      root: '/'
    });
  },

  // This is how you navigate around the app.
  // this gets called by a global click handler that handles
  // all the <a> tags in the app.
  // it expects a url without a leading slash.
  // for example: "costello/settings".
  navigate: function (page) {
    var url = (page.charAt(0) === '/') ? page.slice(1) : page;
    this.router.history.navigate(url, {
      trigger: true
    });
  }
});

// run
domReady(app.init.bind(app));
