var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'report.[chunkhash].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: true
        }
      },
      /**
       * Bundle JavaScript (ES6)
       */
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },

      /**
       * Bundle CSS, images and fonts
       */
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader')
          }
        ]
      },
      { test: /\.(otf|ttf|woff|woff2)$/, use: { loader: 'url-loader?limit=10000' } },
      { test: /\.(jpg|png|gif)$/, use: { loader: 'url-loader?limit=10000' } },
      { test: /\.(eot|svg)$/, use: { loader: 'file-loader' } },
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' }
    ]
  },
  plugins: [
    /**
     * Make jquery and lodash globally available
     * (dependencies of @leanix/reporting library)
     */
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      '_': 'lodash'
    }),

    /**
     * Copy assets into dist folder.
     */
    new CopyWebpackPlugin([
      { from: 'src/assets', to: 'assets' }
    ]),

    /**
     * Insert created bundles as script tags at the end
     * of the body tag in index.html
     */
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/index.html'
    }),
    new ExtractTextPlugin('style.css')
  ],

  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
