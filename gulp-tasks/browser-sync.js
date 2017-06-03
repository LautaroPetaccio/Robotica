/* Imports */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');

/* Browser-sync tasks */

gulp.task('browser-sync-init', function() {
  browserSync.init({
    server: {
      baseDir: "dist/"
    }
  });
});

gulp.task('browser-sync-watch', function() {
  gulp.watch('src/app/templates/*.hbs').on('change', function() {
    runSequence('html-index', 'browser-sync-reload');
  });
  gulp.watch('src/app/**/*.js').on('change', function() {
    runSequence('scripts-app', 'browser-sync-reload');
  });
  gulp.watch('src/app/**/*.{scss,sass}').on('change', function() {
    runSequence('styles-app', 'browser-sync-reload');
  });
  gulp.watch('src/game/**/*.js').on('change', function() {
    runSequence('scripts-game', 'browser-sync-reload');
  });
  gulp.watch('src/game/data/*').on('change', function() {
    runSequence('assets-game', 'browser-sync-reload');
  });
});

gulp.task('browser-sync-reload', function() {
  browserSync.reload();
});
