const path = require('path')
const webpack = require('webpack')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')

const contentPath = path.resolve(__dirname, '../build')

module.exports = {
  devServer: {
    contentBase: contentPath,
    hot: true,
    port: 5500,
  },
  entry: {
    app: './src/index.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
    ],
  },
  output: {
    filename: '[name].bundle.js',
    path: contentPath,
  },
  plugins: [
    new DashboardPlugin(),
    new CleanWebpackPlugin(['build']),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, '../src/templates/index.html'),
      filename: './index.html',
    }),
  ],
}
