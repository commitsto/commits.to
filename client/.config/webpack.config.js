const path = require('path')
const webpack = require('webpack')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');

const templatePath = path.resolve(__dirname, '../src/templates/index.html')
const contentPath = path.resolve(__dirname, '../build')
const tsconfigPath = path.resolve(__dirname, 'tsconfig.json')
const tslintPath = path.resolve(__dirname, 'tslint.json')

module.exports = {
  devServer: {
    contentBase: contentPath,
    hot: true,
    port: 5500,
  },
  devtool: 'inline-source-map',
  entry: {
    app: './src/index',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: tsconfigPath,
            transpileOnly: true,
          },
        }],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        }],
      },
    ],
  },
  output: {
    filename: '[name].bundle.js',
    path: contentPath,
  },
  plugins: [
    new ForkTsCheckerPlugin({
      checkSyntacticErrors: true,
      tsconfig: tsconfigPath,
      tslint: tslintPath,
      excludeWarnings: true,
    }),
    new DashboardPlugin(),
    new CleanWebpackPlugin(['build']),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      template: templatePath,
      filename: './index.html',
      title: 'commits.to | the i-will system',
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    // alias: {
    // TODO
    // }
  },
}
