"use strict";

const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function(webpack, webpackConfig, config) {

  const webpackServerExternal = config.is("build.webpack.serverExternal");
  webpackConfig.output.path = config.getTarget("static/script");

  webpackConfig.entry = {
    "vendor": [
      "./client/vendor"
    ],
    "app": [
      "./client/main"
    ]
  };
  webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: ["vendor"]
  }));

  /**
   * Extract CSS, SCSS to external file.
   */
  const extractStyle = new ExtractTextPlugin("./style/main.css");
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
   * Include the DLL references.
   */
  webpackConfig.plugins.push(new webpack.DllReferencePlugin({
    context: config.root,
    manifest: require(config.getSource("client/static/script", "provider-manifest.json"))
  }));

  return webpackConfig;
};
