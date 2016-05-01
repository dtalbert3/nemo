const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const merge = require('webpack-merge')
const autoprefixer = require('autoprefixer')

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build')
}

const env = process.env.NODE_ENV || 'development'
const isDev = env === 'development'

const common = {
  devtool: isDev ? 'eval-source-map' : false,
  debug: isDev,
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.BABEL_ENV': JSON.stringify(env)
    })
  ],
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.(css|styl)$/,
      loader: 'style-loader!css-loader!stylus-loader'
    }, {
      test: /\.(ico)$/,
      loader: 'static-loader'
    }]
  },
  postcss: function () {
    return [autoprefixer]
  }
}

if (isDev) {
  module.exports = merge(common, {
    entry: [
      'webpack-hot-middleware/client?reload=true',
      PATHS.app
    ],
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  })
} else {
  module.exports = merge(common, {
    entry: [
      PATHS.app
    ],
    plugins: [
      new CleanPlugin(PATHS.build),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 51200, // ~50kb
      }),
      new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        compress: {
          warnings: false,
        },
      })
    ]
  })
}
