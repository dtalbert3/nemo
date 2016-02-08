var feathers = require('feathers');
var socketio = require('feathers-socketio');
var helmet = require('helmet');
var Moonboots = require('moonboots-express');
var config = require('getconfig');
var stylizer = require('stylizer');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var templatizer = require('templatizer');

var app = feathers().configure(socketio());

// Setup HTTP headers
app.use(helmet());

// Set up template view engine
app.set('view engine', 'jade');

// TODO look into compressing express page
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

// Set client config cookies
app.use(function (req, res, next) {
  res.cookie('config', JSON.stringify(config.client));
  next();
});

// Setup NEMO api
var nemoApi = require('./nemoApi');
app.use('/user', nemoApi.userService);

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

// Start listen server
app.listen(config.http.port);
console.log('[*] HTTP server listening on port:' + config.http.port);
