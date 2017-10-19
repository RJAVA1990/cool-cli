'use strict';

const webpack = require('webpack');
const HappyPack = require('happypack');
const os = require('os');
const path = require('path');
const { srcPath, buildPath, nodeModulesPath } = require('./paths');

module.exports = {
  context: srcPath,
  devtool: 'cheap-module-eval-source-map',
  entry: `${srcPath}/index.js`,
  externals: {},
  output: {
    path: buildPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
    crossOriginLoading: 'anonymous',
  },
  resolve: {
    modules: ['node_modules', nodeModulesPath, srcPath],
    extensions: ['.js', '.json', '.jsx'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HappyPack({
      id: 'js',
      cache: true,
      threads: os.cpus().length,
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          },
        },
      ],
    }),
    new HappyPack({
      id: 'css',
      cache: true,
      threads: os.cpus().length,
      loaders: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            modules: false,
          },
        },
        {
          loader: 'postcss-loader',
          query: {
            config: path.resolve(__dirname, '..', 'postcss.config.js'),
          },
        },
      ],
    }),
    new HappyPack({
      id: 'scss',
      cache: true,
      threads: os.cpus().length,
      loaders: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1,
            localIdentName: '[name]__[local]___[hash:base64:5]',
          },
        },
        {
          loader: 'postcss-loader',
          query: {
            config: path.resolve(__dirname, '..', 'postcss.config.js'),
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'happypack/loader?id=css',
      },
      {
        test: /\.scss$/,
        use: 'happypack/loader?id=scss',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=application/octet-stream',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=image/svg+xml',
      },
      {
        test: /\.jsx?$/,
        use: 'happypack/loader?id=js',
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ['url-loader?limit=8192'],
        exclude: /node_modules/,
      },
      {
        test: /\.swf$/,
        use: 'file-loader?name=[name].[ext]',
      },
    ],
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, '..', 'node_modules')],
  },
};
