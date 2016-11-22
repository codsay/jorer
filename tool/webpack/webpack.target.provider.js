"use strict";

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const join = require("path").join;

module.exports = function(webpack, webpackConfig, config) {

  webpackConfig.entry = {
    "provider": [
      "./client/vendor"
    ]
  };

  webpackConfig.output.path = config.getSource("client/static/script");
  webpackConfig.output.library = "[name]";

  /**
   * Extract CSS, SCSS to external file.
   */
  const extractStyle = new ExtractTextPlugin("../style/provider.css");
  webpackConfig.module.rules.push({
    test: /\.css$/,
    loader: extractStyle.extract([
      "css-loader",
      "postcss-loader"
    ])
  });
  webpackConfig.module.rules.push({
    test: /\.scss$/,
    loader: extractStyle.extract([
      "css-loader",
      "postcss-loader",
      "sass-loader"
    ])
  });
  webpackConfig.plugins.push(extractStyle);

  /**
   * DLL configuration.
   */
  webpackConfig.plugins.push(new webpack.DllPlugin({
    context: config.getPath(""),
    path: join(webpackConfig.output.path, "[name]-manifest.json"),
    name: "[name]"
  }));

  webpackConfig.plugins.push(new webpack.NoErrorsPlugin());
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    output: {
      comments: false
    },
    mangle: false
  }));

  return webpackConfig;
};
