"use strict";

const gutil = require("gulp-util");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("../webpack/webpack.bootstrap");

exports.register = function(gulp, config) {

  const webpackCompiler = webpack(webpackConfig);

  let statsOpt = {
    hash: true,
    version: true,
    timings: true,
    assets: false,
    chunks: true,
    chunkModules: false,
    modules: false,
    children: false,
    cached: true,
    reasons: false,
    source: false,
    errorDetails: true,
    chunkOrigins: false,
    colors: true
  };

  gulp.task("webpack", function(done) {
    webpackCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("[webpack]", err);
        gutil.log("[webpack]", stats.toString(statsOpt));
        done();
    });
  });

  gulp.task("webpack-server", function(done) {
    new WebpackDevServer(webpackCompiler, {
    }).listen(1806, "localhost", function(err) {
      if(err) throw new gutil.PluginError("[webpack-dev-server]", err);
      gutil.log("[webpack-dev-server]", "http://localhost:1806/webpack-dev-server/index.html");
    });
  });

};
