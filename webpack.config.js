const path = require('path');
const nodeExternals = require('webpack-node-externals');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');
const {NODE_ENV = 'production'} = process.env;

module.exports = {
  entry: path.join(__dirname, '/src/octoprint-api.ts'),
  mode: NODE_ENV,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  watch: NODE_ENV === 'development',
  plugins: [
    new CleanWebpackPlugin(),
    new TSLintPlugin({
      files: ['./src/**/*.ts'],
    }),
  ],
  externals: [nodeExternals()],
};
