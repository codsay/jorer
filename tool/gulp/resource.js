"use strict";

const batch = require("gulp-batch");
const watch = require("gulp-watch");
const runSequence = require("run-sequence");

exports.register = function(gulp, config) {
  gulp.task("resource", function(done) {
    runSequence(
      "_static",
      done
    );
  });
  gulp.task("resource:w", function(done) {
    runSequence(
      "_static.watch",
      done
    );
  });

  let staticPaths = [
    config.getSource("client/static/**/*.*"),
    "!" + config.getSource("client/static/style/**/*.*")
  ];
  gulp.task("_static", function() {
    return gulp
      .src(staticPaths)
      .pipe(gulp.dest(config.getTarget("static")));
  });
  gulp.task("_static.watch", function(done) {
    watch(staticPaths, batch({
      timeout: config.get("build.batch.time", 2000)
    }, function(e, wdone) {
      runSequence("_static", wdone)
    }));
    done();
  });
}
