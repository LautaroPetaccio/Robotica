/* Imports */
var gulp = require('gulp');
var newer = require('gulp-newer');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var imagemin = require('gulp-imagemin');
var path = require('path');
var generateMapsModal = require(path.resolve(__dirname, './generateMapsModal.js'));

gulp.task('maps-modal', [], function() {
  var modelTemplate = 'src/app/home/simulator/maps-modal/maps-modal.tpl';
  gulp.src('src/game/data/map/**/*.png')
            .pipe(newer('dist/maps-thumbnails'))
            .pipe(imagemin())
            .pipe(gulp.dest('dist/maps-thumbnails'))
            .on('error', plugins.util.log);
  gulp.src('src/game/data/map/**/*.tmx')
            .pipe(generateMapsModal(modelTemplate, '../maps-thumbnails/'))
            .pipe(plugins.flatten())
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.htmlmin({collapseWhitespace: true}))
            .pipe(plugins.sourcemaps.write('../maps/'))
            .pipe(gulp.dest('dist/html/'))
            .on('error', plugins.util.log);
});