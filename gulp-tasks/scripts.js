/* Imports */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var mainBowerFiles = require('main-bower-files');
var path = require('path');
var bundleMelonJSResources = require(path.resolve(__dirname, './bundleMelonJSResources.js'));

/* Scripts tasks */

gulp.task('scripts', ['scripts-src', 'scripts-third-party']);

gulp.task('scripts-src', ['scripts-app', 'scripts-game']);

gulp.task('scripts-app', [], function() {
  return gulp.src('src/app/**/*.js')
          .pipe(plugins.flatten())
          //.pipe(plugins.eslint())
          //.pipe(plugins.eslint.format())
          .pipe(plugins.concat('app.min.js'))
          .pipe(plugins.sourcemaps.init())
          .pipe(plugins.uglify())
          .pipe(plugins.sourcemaps.write('../maps/'))
          .pipe(gulp.dest('dist/scripts/'))
          .on('error', plugins.util.log);
});

gulp.task('scripts-game', [], function() {
  return gulp.src('src/game/**/*.js')
          .pipe(plugins.flatten())
          //.pipe(plugins.eslint())
          //.pipe(plugins.eslint.format())
          .pipe(plugins.concat('game.min.js'))
          .pipe(plugins.sourcemaps.init())
          .pipe(plugins.uglify())
          .pipe(plugins.sourcemaps.write('../maps/'))
          .pipe(gulp.dest('dist/scripts/'))
          .on('error', plugins.util.log);
});

gulp.task('scripts-third-party', ['scripts-bower', 'scripts-blockly', 'scripts-melonjs', 'scripts-acorn']);

gulp.task('scripts-bower', [], function() {
  return gulp.src(mainBowerFiles())
          .pipe(plugins.filter("**/*.js"))
          .pipe(plugins.flatten())
          .pipe(plugins.concat('bower.min.js'))
          .pipe(plugins.sourcemaps.init())
          .pipe(plugins.uglify())
          .pipe(plugins.sourcemaps.write('../maps/'))
          .pipe(gulp.dest('dist/scripts/'))
          .on('error', plugins.util.log);
});

gulp.task('scripts-blockly', [], function() {
  return gulp.src([
            'third-party/google-blockly/blockly_compressed.js',
            'third-party/google-blockly/blocks_compressed.js',
            'third-party/google-blockly/javascript_compressed.js',
            'third-party/google-blockly/msg/js/en.js'
          ])
          .pipe(plugins.flatten())
          .pipe(plugins.concat('blockly.min.js'))
          .pipe(plugins.sourcemaps.init())
          .pipe(plugins.uglify())
          .pipe(plugins.sourcemaps.write('../maps/'))
          .pipe(gulp.dest('dist/scripts/'))
          .on('error', plugins.util.log);
});

gulp.task('scripts-melonjs', [], function() {
  return gulp.src([
            'third-party/melonjs/melonJS.js',
            'third-party/melonjs/plugins/**/*.js'
          ])
          .pipe(plugins.flatten())
          .pipe(plugins.concat('melonjs.min.js'))
          .pipe(plugins.sourcemaps.init())
          .pipe(plugins.uglify())
          .pipe(plugins.sourcemaps.write('../maps/'))
          .pipe(gulp.dest('dist/scripts/'))
          .on('error', plugins.util.log);
});

gulp.task('bundle-melonjs-resources', [], function() {
  return gulp.src('src/game/data/**/*')
          .pipe(plugins.flatten())
          .pipe(bundleMelonJSResources('resources.min.js', 'assets/game/'))
          .pipe(plugins.sourcemaps.init())
          .pipe(plugins.uglify())
          .pipe(plugins.sourcemaps.write('../maps/'))
          .pipe(gulp.dest('dist/scripts/'))
          .on('error', plugins.util.log);
});

gulp.task('scripts-acorn', [], function() {
  return gulp.src([
            'third-party/acorn/acorn_interpreter.js'
          ])
          .pipe(plugins.flatten())
          .pipe(plugins.concat('acorn.min.js'))
          .pipe(plugins.sourcemaps.init())
          .pipe(plugins.uglify())
          .pipe(plugins.sourcemaps.write('../maps/'))
          .pipe(gulp.dest('dist/scripts/'))
          .on('error', plugins.util.log);
});
