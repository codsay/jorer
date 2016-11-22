"use strict";

const HappyPack = require('happypack');

module.exports = function(webpack, webpackConfig, config) {

  webpackConfig.context = config.getSource();
  webpackConfig.resolve = {
    extensions: [".js", ".jsx"],
    modules: ["node_modules", "src"],
    alias: {
      "@app/fusion": "fusion",
      "@app/common": "client/common",
      "@app/core": "client/core",
      "@app/module": "client/module",
      "@app/static": "client/static",

      "masonry-layout": "masonry-layout/masonry.js"
    }
  };

  webpackConfig.module.rules.push({
    test: /\.jsx$/,
    use: [{
      loader: "babel-loader",
      options: {
        presets: ['react', 'latest']
      }
    }]
  });

  webpackConfig.module.rules.push({
    test: /isotope\-|fizzy\-ui\-utils|desandro\-|masonry|outlayer|get\-size|doc\-ready|eventie|eventemitter/,
    use: "imports?define=>false&this=>window"
  });
  webpackConfig.module.rules.push({
    test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
    use: "file-loader?name=../style/fonts/[name].[ext]"
  });

  /*
   * Stop the build if there is any error.
   */
  webpackConfig.plugins.push(new webpack.NoErrorsPlugin({
  }));

  /**
   * Plugin LoaderOptionsPlugin (experimental)
   *
   * See: https://gist.github.com/sokra/27b24881210b56bbaff7
   */
  webpackConfig.plugins.push(new webpack.LoaderOptionsPlugin({
  }));

  return webpackConfig;
};
