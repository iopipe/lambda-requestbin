const path = require('path');
// eslint-disable-next-line import/no-unresolved
const slsw = require('serverless-webpack');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  module: {
    loaders: [{
      test: /\.(js|node)$/,
      loaders: ['babel-loader', 'node-loader'],
      include: __dirname
    }],
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
};
