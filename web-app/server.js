const helmet = require('helmet')
const config = require('getconfig')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const path = require('path')
const fs = require('fs')

const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config.js')

// Setup our express app
const app = require('express')()

// Start HTTPS Server
// const credentials = {
//   key: fs.readFileSync(__dirname + config.server.ssl.keyPath, 'utf8'),
//   cert: fs.readFileSync(__dirname + config.server.ssl.certPath, 'utf8')
// }
// const server = require('https').createServer(credentials, app)

// Start HTTP Server
const server = require('http').createServer(app)

// Create Socket
const io = require('socket.io')(server)
// const socketioJwt = require('socketio-jwt')

// Setup webpack
const compiler = webpack(webpackConfig)
const middleware = webpackMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  contentBase: 'src',
  stats: {
    colors: true,
    progress: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }
})

if (config.isDev) {
  app
    .use(webpackHotMiddleware(compiler))
}

// Setup express app
app
  .use(middleware)
  .use(helmet())
  // .use(serveStatic(__dirname + '/build'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))

// Redirect requests back to /
// Unless path equals /confirm?hash=
app.all('*', function (req, res) {
  if ((/confirm*.*/).test(req.url)) {
    var url = (config.http.userHttps ? 'https://' : 'http://') +
      config.http.listen + ':' +
      config.http.port
    nemoApi.confirmEmail(req.query.hash, function(msg) {
      res.writeHeader(200, {"Content-Type": "text/html"});
      res.write(
        '<!DOCTYPE html><body>' +
          msg +
          '<script>window.setTimeout(function(){ window.location = "' + url + '"; }, 3000);</script>' +
        '</body></html>')
      res.end()
    })
  } else {
    res.redirect('/')
  }
})

app.get('/*', function response(req, res) {
  res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'build/index.html')))
  res.end()
})

// Setup our API over socket connections
const nemoApi = require('./nemoApi')
io.of('/auth').on('connection', function(socket) {
  nemoApi.authService(socket)
})

io.of('/user')
  .on('connection', function(socket) {
    nemoApi.userService(socket)
  })

io.of('/qstn')
  .on('connection', function(socket) {
    nemoApi.questionService(socket)
  })

io.of('/dash')
  .on('connection', function(socket) {
    nemoApi.dashboardService(socket)
  })

// Start our server on designated port
server.listen(config.http.port)
