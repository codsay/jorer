"use strict";

const gulp = require("gulp");
const runSequence = require("run-sequence");

const logger = require("log4js").getLogger(__filename);
const config = require("./tool/config");

// Define all tasks
const ALL_TASK = {
  "clean": {},
  "resource": {},
  "resource:w": {
    file: "resource"
  },
  "webpack": {},
  "webpack-server": {
    file: "webpack"
  },
  "build": {
    dependencies: ["webpack"]
  },
}

// Find all tasks
const tasks = [];
const taskFiles = [];
(function checkTask(nameOrNames) {
  if (!nameOrNames) return;
  if (Array.isArray(nameOrNames)) {
    for (const name of nameOrNames) {
      checkTask(name);
    }
    return;
  }
  const name = nameOrNames;
  const task = ALL_TASK[name];
  if (task && typeof task !== "string") {
    checkTask(task.dependencies);
  }
  let file = name;
  if (task && task.file) {
    file = task.file;
  }
  if (tasks.indexOf(name) < 0) tasks.push(name);
  if (taskFiles.indexOf(file) < 0) taskFiles.push(file);
})(config.tasks);

// Load all tasks
(function(_config) {
  for (const task of taskFiles) {
    try {
      logger.debug("Loading Gulp task", "./tool/gulp/" + task);
      require("./tool/gulp/" + task).register(gulp, _config);
    } catch (e) {
      if (e.message.indexOf("Error Cannot find module") == 0) {
        //logger.info("Task " + task + " is just a virtual task.");
      }
      logger.info("Task " + task + " is just a virtual task.");
    }
  }

  logger.debug("Gulp Tasks to be excuted:", tasks);
  gulp.task("execute", function(done) {
    tasks.push(done);
    runSequence.apply(this, tasks);
  });

})(config);
