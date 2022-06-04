const { merge } = require('webpack-merge');
const commonConfigs = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = merge(commonConfigs, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, './template'),
    },
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './template/config.html'),
      appMountId: 'root',
      inject: false,
      filename: 'config.html',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './template/app.html'),
      appMountId: 'root',
      inject: false,
      filename: 'app.html',
    }),
  ],
});
