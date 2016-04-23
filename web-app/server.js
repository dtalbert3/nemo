
const helmet = require('helmet')
const config = require('getconfig')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const serveStatic = require('serve-static')
const path = require('path')

const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config.js')

// Setup our express app
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
// const socketioJwt = require('socketio-jwt')

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

app
  .use(middleware)
  .use(webpackHotMiddleware(compiler))
  .use(helmet())
  .use(serveStatic(__dirname + '/build'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .use(function (req, res, next) {
    res.cookie('config', JSON.stringify(config.client))
    next()
  })

// Redirect all requests back to /
app.all('*', function (req, res) {
  res.redirect('/')
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

io
  .of('/user')
  .on('connection', function(socket) {
    nemoApi.userService(socket)
  })

io
  .of('/qstn')
  .on('connection', function(socket) {
    nemoApi.questionService(socket)
  })

io
  .of('/dash')
  .on('connection', function(socket) {
    nemoApi.dashboardService(socket)
  })

server.listen(config.http.port)
