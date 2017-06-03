/* Imports */
var gulp = require('gulp');
var newer = require('gulp-newer');
var plugins = require('gulp-load-plugins')(['gulp-*']);
// const handlebars = require('gulp-compile-handlebars');
const hb = require('gulp-hb');
const rename = require('gulp-rename');
var path = require('path');
const gulpHelpers = require(path.resolve(__dirname, './gulp-helpers.js'));


/* Html tasks */

gulp.task('html', ['html-index']);

/* TODO: check that if any of the templates files are new */
gulp.task('html-index', [], function() {
  var mapsData = gulpHelpers.generateMapsData();
  return gulp.src('src/app/templates/index.hbs')
          .pipe(hb({
              helpers: [
                  'node_modules/handlebars-layouts/index.js'
              ],
              data : {maps : mapsData},
              partials: 'src/app/templates/*.hbs'
          }))
          // .pipe(handlebars({maps : mapsData}, {
          //   ignorePartials: true,
          //   batch: ['src/app/templates/']
          // }))
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