const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'options' : './components/options.jsx',
    'app' : './components/app.jsx',
  },
  output: {
    path: path.join(__dirname, '/app/'),
    filename: '[name].js',
    publicPath: '/'
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [{
      test: /\.jsx$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015']
      }
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }]
  }

};
