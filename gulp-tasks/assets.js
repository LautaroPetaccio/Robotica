/* Imports */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(['gulp-*']);

/* Assets tasks */

gulp.task('assets', ['favicon', 'assets-game', 'assets-third-party']);

gulp.task('favicon', [], function() {
  return gulp.src('src/app/**/favicon.ico')
          .pipe(plugins.flatten())
          .pipe(gulp.dest('dist/'))
          .on('error', plugins.util.log);
});

gulp.task('assets-game', ['bundle-melonjs-resources'], function() {
  return gulp.src(['src/game/data/**/*', 'src/game/icons/**/*'])
          .pipe(plugins.flatten())
          .pipe(gulp.dest('dist/assets/game/'))
          .on('error', plugins.util.log);
});

gulp.task('assets-third-party', ['assets-blockly']);

gulp.task('assets-blockly', [], function() {
  return gulp.src('third-party/google-blockly/media/**/*')
          .pipe(plugins.flatten())
          .pipe(gulp.dest('dist/assets/blockly/'))
          .on('error', plugins.util.log);
});
