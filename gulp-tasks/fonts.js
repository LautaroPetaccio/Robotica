/* Imports */
var gulp = require('gulp');
var newer = require('gulp-newer');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var mainBowerFiles = require('main-bower-files');

/* Fonts tasks */

gulp.task('fonts', ['fonts-bootstrap', 'fonts-mdi']);

gulp.task('fonts-bootstrap', [], function() {
  return gulp.src(mainBowerFiles(), { cwd: '.' })
          .pipe(plugins.filter(['bower_components/bootstrap-sass/**/*.{eot,svg,ttf,woff,woff2}']))
          .pipe(newer('dist/fonts/bootstrap/'))
          .pipe(gulp.dest('dist/fonts/bootstrap/'))
          .on('error', plugins.util.log);
});

gulp.task('fonts-mdi', [], function() {
  return gulp.src(mainBowerFiles())
          .pipe(plugins.filter(['bower_components/mdi/**/*.{eot,svg,ttf,woff,woff2}']))
          .pipe(newer('dist/fonts/'))
          .pipe(gulp.dest('dist/fonts/'))
          .on('error', plugins.util.log);
});
