const path = require('path')
const webpack = require('webpack')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin')

// const serverPath = path.resolve(__dirname, '../server/app/index') TODO
// const templatePath = path.resolve(__dirname, '../src/templates/index.html')
const rootPath = path.resolve(__dirname, '../');
const contentPath = path.resolve(__dirname, '../build')
const tsconfigPath = path.resolve(__dirname, '../tsconfig.json')
const tslintPath = path.resolve(__dirname, '../tslint.json')

module.exports = {
  // mode: 'development',
  // watch: true,
  devServer: {
    contentBase: contentPath,
    hot: true,
    port: 8080,
    disableHostCheck: true, // use aliased host/domain names,
    historyApiFallback: true, // for react-router-dom
    proxy: {
      '/api/v1': 'http://localhost:8020',
    }
  },
  devtool: 'cheap-module-eval-source-map',
  entry: {
    vendor: [
      '@babel/polyfill',
    ],
    app: './client/src/index',
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
            babelrc: false,
            presets: [
              [
                '@babel/preset-env',
                { targets: { browsers: 'last 2 versions' } },
              ],
              '@babel/preset-typescript',
              '@babel/preset-react',
            ],
            plugins: [
              'babel-plugin-styled-components',
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              'react-hot-loader/babel',
            ],
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
    new CleanWebpackPlugin(['build'], { root: rootPath }), // TODO dev only
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
