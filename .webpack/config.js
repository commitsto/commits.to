const path = require('path');
const webpack = require('webpack');

const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');

const rootPath = path.resolve(__dirname, '../');
const contentPath = path.resolve(__dirname, '../build/client');
const templatePath = path.resolve(__dirname, '../client/app.html');
const tsconfigPath = path.resolve(__dirname, '../tsconfig.json');
const tslintPath = path.resolve(__dirname, '../tslint.json');

module.exports = {
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
  output: {
    filename: '[name].bundle.js',
    path: contentPath,
    pathinfo: false, // https://github.com/webpack/webpack/issues/6767#issuecomment-410899686,
    publicPath: '/', // sets base url
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        '*.bundle.js',
        '*.hot-update.json'
      ],
      verbose: true,
    }),
    new ForkTsCheckerPlugin({
      checkSyntacticErrors: true,
      tsconfig: tsconfigPath,
      tslint: tslintPath,
      excludeWarnings: true,
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      template: templatePath,
      filename: './app.html',
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
