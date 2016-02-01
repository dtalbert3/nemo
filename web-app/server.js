var express = require('express');
var helmet = require('helmet');
var Moonboots = require('moonboots-express');
var config = require('getconfig');
var stylizer = require('stylizer');
var Sequelize = require('sequelize');
var templatizer = require('templatizer');

var app = express();

// Setup HTTP headers
app.use(helmet());

// Set up view engine
app.set('view engine', 'jade');

// Create database
var sequelize = new Sequelize(
  config.db.name,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect, // or 'sqlite', 'postgres', 'mariadb'
    port:    config.db.port, // or 5432 (for postgres)
  });

// Connect to database
sequelize
  .authenticate()
  .then(function() {
    console.log('Connection has been established successfully.');
  }, function (err) {
    console.log('Unable to connect to the database:', err);
  });

// Setup files to be used for client side app
new Moonboots({
  moonboots: {
    jsFileName: 'nemo-js',
    cssFileName: 'nemo-css',
    main: __dirname + '/client/app.js',
    developmentMode: config.isDev,
    libraries: [],
    stylesheets: [
      __dirname + '/public/css/bootstrap.css',
      __dirname + '/public/css/app.css'
    ],
    browserify: {
      debug: false
    },
    beforeBuildJS: function () {
      // This re-builds our template files from jade each time the app's main
      // js file is requested. Which means you can seamlessly change jade and
      // refresh in your browser to get new templates.
      if (config.isDev) {
        templatizer(
          __dirname + '/templates',
          __dirname + '/client/templates.js', {},
          function (err) {
            console.log(err || 'Success!');
          }
        );
      }
    },
    beforeBuildCSS: function () {
      // This re-builds css from stylus each time the app's main
      // css file is requested. Which means you can seamlessly change stylus files
      // and see new styles on refresh.
      if (config.isDev) {
        stylizer({
            infile: __dirname + '/public/css/app.styl',
            outfile: __dirname + '/public/css/app.css',
            development: true
          },
          function (err) {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    }
  },
  server: app
});

app.listen(config.http.port);
