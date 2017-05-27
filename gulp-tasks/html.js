/* Imports */
var gulp = require('gulp');
var newer = require('gulp-newer');
var plugins = require('gulp-load-plugins')(['gulp-*']);
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
var path = require('path');
const gulpHelpers = require(path.resolve(__dirname, './gulp-helpers.js'));


/* Html tasks */

gulp.task('html', ['html-index']);

gulp.task('html-index', [], function() {
  var mapsData = gulpHelpers.generateMapsData();
  return gulp.src('src/app/templates/index.hbs')
          .pipe(handlebars({maps : mapsData}, {
            ignorePartials: true,
            batch: ['src/app/templates/']
          }))
          .pipe(rename({
            extname: '.html'
          }))
          .pipe(newer('dist/index.html'))
          .pipe(plugins.sourcemaps.init())
          .pipe(plugins.htmlmin({collapseWhitespace: true}))
          .pipe(plugins.sourcemaps.write('maps/'))
          .pipe(gulp.dest('dist/'))
          .on('error', plugins.util.log);
});