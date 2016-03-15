var path = require('path')
var webpack = require('webpack')

require('dotenv').load()

module.exports = {
  devtool: 'source-map',
  entry: [
    //'webpack-hot-middleware/client',
    './web/static/js/app.js',
  ],
  resolve: {
    modulesDirectories: [ __dirname + "/web/static/js", "node_modules"],
    alias: {
      phoenix_html:
        __dirname + "/deps/phoenix_html/web/static/js/phoenix_html.js",
      phoenix:
        __dirname + "/deps/phoenix/web/static/js/phoenix.js"
    }
  },
  output: {
    path: "./priv/static/js",
    filename: 'app.js',
  },
  plugins: [
    new webpack.ProvidePlugin({
      "fetch": "imports?this=>global!exports?global.fetch!whatwg-fetch"
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'web/static'),
      },
      {
        test: /\.sass$/,
        loader: 'style!css?modules&importLoaders=2&localIdentName=[local]___[hash:base64:5]!sass?outputStyle=expanded&imagePath=/assets/images&indentedSyntax=true&includePaths[]=' + path.resolve(__dirname, './assets/stylesheets'), // eslint-disable-line max-len
      },
    ],
  },
}
