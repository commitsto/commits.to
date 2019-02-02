const path = require('path')
const webpack = require('webpack')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin')

// const templatePath = path.resolve(__dirname, '../src/templates/index.html')
const rootPath = path.resolve(__dirname, '../');
const contentPath = path.resolve(__dirname, '../build/client')
const tsconfigPath = path.resolve(__dirname, '../client/tsconfig.json')
const tslintPath = path.resolve(__dirname, '../tslint.json')

const { PORT, CLIENT_PORT } = require('../lib/config');

module.exports = {
  devServer: {
    contentBase: contentPath,
    hot: true,
    port: CLIENT_PORT,
    disableHostCheck: true, // use aliased host/domain names,
    historyApiFallback: true, // for react-router-dom
    proxy: {
      '/api/v1': `http://localhost:${PORT}`,
    }
  },
  devtool: 'cheap-module-eval-source-map',
  entry: {
    vendor: [
      '@babel/polyfill',
    ],
    app: `${rootPath}/client/src`,
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },
    // TODO: dev only
    // optimization: {
    //   splitChunks: {
    //     chunks: 'all',
    //   },
    //   runtimeChunk: true,
    // },
  output: {
    filename: '[name].bundle.js',
    path: contentPath,
    pathinfo: false, // https://github.com/webpack/webpack/issues/6767#issuecomment-410899686,
    publicPath: '/', // sets base url
  },
  plugins: [
    new CleanWebpackPlugin(['build/client'], { root: rootPath }), // TODO dev only
    new ForkTsCheckerPlugin({
      checkSyntacticErrors: true,
      tsconfig: tsconfigPath,
      tslint: tslintPath,
      excludeWarnings: true,
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      // template: templatePath,
      filename: './index.html',
      title: 'commits.to | the i-will system',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      src: `${rootPath}/client/src`,
      lib: `${rootPath}/lib`,
    }
  },
}
