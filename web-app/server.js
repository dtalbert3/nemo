var helmet = require('helmet');
var Moonboots = require('moonboots-express');
var config = require('getconfig');
var stylizer = require('stylizer');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// Setup our express app
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var socketioJwt = require('socketio-jwt');

app
  .use(helmet())
  .use(serveStatic(__dirname + '/public'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .use(function (req, res, next) {
    res.cookie('config', JSON.stringify(config.client));
    next();
  });

// Enable hot reloading of es6 client files in src/
if (config.isDev) {
  var shelljs = require('shelljs');
  var fsmonitor = require('fsmonitor');
  fsmonitor.watch('src/', null, function() {
    console.log('\nRebuilding . . .');
    shelljs.exec('npm run build &');
  });
}

// Setup our API
var nemoApi = require('./nemoApi');
io.of('/auth').on('connection', function(socket) {
  nemoApi.authService(socket);
});

io
  .of('/user')
  .use(socketioJwt.authorize({
    secret: config.session.secret,
    algorithm : 'HS256'
  }))
  .on('connection', function(socket) {
    nemoApi.hooks.auth(socket);
    nemoApi.userService(socket);
  });

io
  .of('/qstn')
  .use(socketioJwt.authorize({
    secret: 'your secret or public key',
    handshake: true
  })).on('connection', function(socket) {
    nemoApi.hooks.auth(socket);
    nemoApi.questionService(socket);
  });

io
  .of('/dash')
  .use(socketioJwt.authorize({
    secret: 'your secret or public key',
    handshake: true
  })).on('connection', function(socket) {
    nemoApi.hooks.auth(socket);
    nemoApi.dashboardService(socket);
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
        }, function (err) {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  },
  server: app
});

server.listen(config.http.port);
console.log('[*] HTTP server listening on port:' + config.http.port);
