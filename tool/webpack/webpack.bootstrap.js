"use strict";
const logger = require("log4js").getLogger(__filename);

const webpack = require("webpack");
const config = require("../config");

let webpackConfigs = config.array("build.webpack.config");
logger.debug("Webpack configs:", webpackConfigs);
if (!webpackConfigs.length) {
  throw new Error("There is no webpack definition.");
}

const webpackConfig = {
  "devtool": "eval-cheap-module-source-map",
  "module": {
    "rules": []
  },
  "plugins": [],
  "output": {
    "filename": "[name].js",
    "chunkFilename": "[id].chunk.js"
  }
};
for (const configName of webpackConfigs) {
  require("./" + configName)(webpack, webpackConfig, config);
}

if (config.is("build.webpack.debug")) {
  logger.debug(webpackConfig);
  logger.debug("=== WEBPACK - rules");
  for (let rule of webpackConfig.module.rules) {
    logger.debug(rule);
  }
}
module.exports = webpackConfig;
