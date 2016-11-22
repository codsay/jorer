"use strict";
const logger = require("log4js").getLogger(__filename);

const join = require("path").join;
const Config = require("./config/config").Config;
const ConfigBuilder = require("./config/config.builder").ConfigBuilder;

const root = process.cwd();
const parameters = [];
const tasks = [];
for (var i = process.argv.length - 1; i >= 2; i--) {
  let argument = process.argv[i];
  if (argument.indexOf("---") === 0) {
    let arg = argument.substring(3);
    if (arg.indexOf("task") === 0) {
      let argTasks = arg.split("=")[1].split(",");
      for (let task of argTasks) {
        let taskName = task.trim();
        if (taskName.length) tasks.push(task.trim());
      }
    } else {
      parameters.unshift(arg);
    }
    process.argv.pop();
  }
}

logger.info("Process:", process.argv);
logger.info("Application:", parameters);
logger.info("Task:", tasks);
let config = new Config(ConfigBuilder.build({
  root: join(root, "resource"),
  arguments: parameters
}));
config.root = root;
config.tasks = tasks;
config.parameters = parameters;

logger.debug(config);
module.exports = config;

Config.prototype.getPath = function() {
  let paths = [root];
  for (let subPath of arguments) paths.push(subPath);
  return join.apply(null, paths);
}
Config.prototype.getSource = function() {
  let paths = [root, this.get("build.source", "src")];
  for (let subPath of arguments) paths.push(subPath);
  return join.apply(null, paths);
}
Config.prototype.getTarget = function() {
  let paths = [root, this.get("build.target", "target")];
  for (let subPath of arguments) paths.push(subPath);
  return join.apply(null, paths);
}
Config.prototype.getModule = function() {
  let paths = [root, this.get("build.module", "node_modules")];
  for (let subPath of arguments) paths.push(subPath);
  return join.apply(null, paths);
}
