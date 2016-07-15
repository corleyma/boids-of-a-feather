const path = require("path");

module.exports = {
  context: __dirname,
  entry: "./main.js",
  output: {
    path: "./",
    filename: "bundle.js",
    devtoolModuleFilenameTemplate: '[resourcePath]',
    devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
  },
  module: {
    loaders: [
      {
        test: [/\.jsx?$/, /\.js?$/],
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  devtool: 'source-maps',
  resolve: {
    extensions: ["", ".js", ".jsx" ]
  },
  engines: {
  // Your versions of node and npm should go here
  // Check this by running the `node -v` and `npm -v` commands in the root of your project
    node: "6.2.1",
    npm: "3.9.3"
  },
  scripts: {
    postinstall: "./node_modules/.bin/webpack"
  }
};
