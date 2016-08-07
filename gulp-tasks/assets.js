/* Imports */
var gulp = require('gulp');
var newer = require('gulp-newer');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var imagemin = require('gulp-imagemin');

/* Assets tasks */

gulp.task('assets', ['favicon', 'assets-game', 'assets-third-party', 'assets-navbar']);

gulp.task('favicon', [], function() {
  return gulp.src('src/app/**/favicon.ico')
          .pipe(newer('dist/'))
          .pipe(plugins.flatten())
          .pipe(gulp.dest('dist/'))
          .on('error', plugins.util.log);
});

gulp.task('assets-navbar', [], function() {
  return gulp.src('src/app/home/navbar/*.png')
          .pipe(newer('dist/assets/navbar/'))
          .pipe(imagemin())
          .pipe(gulp.dest('dist/assets/navbar/'))
          .on('error', plugins.util.log);
});

gulp.task('assets-game', ['bundle-melonjs-resources'], function() {
  return gulp.src(['src/game/data/**/*', 'src/game/icons/**/*'])
          .pipe(newer('dist/assets/game/'))
          .pipe(plugins.flatten())
          .pipe(gulp.dest('dist/assets/game/'))
          .on('error', plugins.util.log);
});

gulp.task('assets-third-party', ['assets-blockly']);

gulp.task('assets-blockly', [], function() {
  return gulp.src('third-party/google-blockly/media/**/*')
          .pipe(newer('dist/assets/blockly/'))
          .pipe(plugins.flatten())
          .pipe(gulp.dest('dist/assets/blockly/'))
          .on('error', plugins.util.log);
});
