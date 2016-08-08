/* Imports */
var gulp = require('gulp');
var newer = require('gulp-newer');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var browserSync = require('browser-sync').create();
var mainBowerFiles = require('main-bower-files');

/* Styles tasks */

gulp.task('styles', ['styles-app', 'styles-bower']);

gulp.task('styles-app', [], function() {
  return gulp.src('src/app/**/*.scss')
          .pipe(newer('dist/styles/app.min.css'))
          .pipe(plugins.flatten())
          .pipe(plugins.sass().on('error', plugins.sass.logError))
          .pipe(plugins.concat('app.min.css'))
          .pipe(plugins.sourcemaps.init())
          .pipe(plugins.cleanCss({compatibility: 'ie8'}))
          .pipe(plugins.sourcemaps.write('../maps/'))
          .pipe(gulp.dest('dist/styles/'))
          .on('error', plugins.util.log);
});

gulp.task('styles-bower', ['styles-bower-scss', 'styles-bower-bootstrap', 'styles-mdi', 'styles-mdi-map']);

gulp.task('styles-bower-scss', [], function() {
  return gulp.src(mainBowerFiles())
          .pipe(plugins.filter(["**/*.{css,scss}", "!bower_components/mdi/**/*"]))
          .pipe(newer('dist/styles/bower-scss.min.css'))
          .pipe(plugins.flatten())
          .pipe(plugins.sass().on('error', plugins.sass.logError))
          .pipe(plugins.concat('bower-scss.min.css'))
          .pipe(plugins.sourcemaps.init())
          .pipe(plugins.cleanCss({compatibility: 'ie8'}))
          .pipe(plugins.sourcemaps.write('../maps/'))
          .pipe(gulp.dest('dist/styles/'))
          .on('error', plugins.util.log);
});

gulp.task('styles-bower-bootstrap', [], function() {
  return gulp.src(mainBowerFiles())
          .pipe(plugins.filter("**/_bootstrap.scss"))
          .pipe(newer('dist/styles/bower-bootstrap.min.css'))
          .pipe(plugins.rename(function(path) { path.basename = 'bootstrap'; }))
          .pipe(plugins.sass().on('error', plugins.sass.logError))
          .pipe(plugins.concat('bower-bootstrap.min.css'))
          .pipe(plugins.sourcemaps.init())
          .pipe(plugins.cleanCss({compatibility: 'ie8'}))
          .pipe(plugins.sourcemaps.write('../maps/'))
          .pipe(gulp.dest('dist/styles/'))
          .on('error', plugins.util.log);
});

gulp.task('styles-mdi', [], function() {
  return gulp.src(mainBowerFiles())
          .pipe(plugins.filter("**/materialdesignicons.min.css"))
          .pipe(gulp.dest('dist/styles/'))
          .on('error', plugins.util.log);
});

gulp.task('styles-mdi-map', [], function() {
  return gulp.src(mainBowerFiles())
          .pipe(plugins.filter("**/materialdesignicons.min.css.map"))
          .pipe(gulp.dest('dist/maps/'))
          .on('error', plugins.util.log);
});
