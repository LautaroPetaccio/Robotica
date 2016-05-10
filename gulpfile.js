/* Imports */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var runSequence = require('run-sequence');
require('require-dir')('gulp-tasks/');

/* Main tasks */

gulp.task('build', [], function() {
    return runSequence(['html', 'scripts', 'styles', 'fonts', 'assets']);
});

gulp.task('serve', [], function() {
    return runSequence(['html', 'scripts', 'styles', 'fonts', 'assets'], 'browser-sync-init', 'browser-sync-watch');
});

gulp.task('clean', [], function() {
    return gulp.src('dist/', {read: false})
            .pipe(plugins.clean());
});

gulp.task('default', [], function() {
    return runSequence('clean', 'build');
});
