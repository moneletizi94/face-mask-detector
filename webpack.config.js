const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'mask.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'models', to: 'models' }]
    }),
    new HtmlWebpackPlugin({
        title: 'Custom template',
        // Load a custom template (lodash by default)
        template: 'src/index.html'
    })
  ]
};