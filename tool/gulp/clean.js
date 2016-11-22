"use strict";

const clean = require("gulp-clean");
const runSequence = require("run-sequence");

exports.register = function(gulp, config) {

  gulp.task("clean", function(done) {
    runSequence(
      "clean-client",
      done
    );
  });

  gulp.task("clean-client", function() {
    return gulp
      .src(config.getTarget("static"), {
        read: false
      })
      .pipe(clean());
  });
};
