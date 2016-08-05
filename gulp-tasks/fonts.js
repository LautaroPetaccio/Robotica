/* Imports */
var gulp = require('gulp');
var newer = require('gulp-newer');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var mainBowerFiles = require('main-bower-files');

/* Fonts tasks */

gulp.task('fonts', [], function() {
  return gulp.src(mainBowerFiles(), { cwd: '.' })
          .pipe(plugins.filter(['**/*.{eot,svg,ttf,woff,woff2}']))
          .pipe(newer('dist/fonts/bootstrap/'))
          .pipe(gulp.dest('dist/fonts/bootstrap/'))
          .on('error', plugins.util.log);
});
