/* Imports */
var gulp = require('gulp');
var newer = require('gulp-newer');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var mainBowerFiles = require('main-bower-files');
var path = require('path');
var bundleMelonJSResources = require(path.resolve(__dirname, './bundleMelonJSResources.js'));

/* Scripts tasks */

gulp.task('scripts', ['scripts-src', 'scripts-third-party']);

gulp.task('scripts-src', ['scripts-app', 'scripts-game']);

gulp.task('scripts-app', [], function() {
  return gulp.src(['src/app/others/*.js', 'src/app/models/*.js', 'src/app/views/*.js', 'src/app/index.js'])
          .pipe(newer('dist/scripts/app.min.js'))
          .pipe(plugins.flatten())
          //.pipe(plugins.eslint())
          //.pipe(plugins.eslint.format())
          .pipe(plugins.concat('app.min.js'))
          .pipe(plugins.sourcemaps.init())
          .pipe(plugins.uglify().on('error', plugins.util.log))
          .pipe(plugins.sourcemaps.write('../maps/'))
          .pipe(gulp.dest('dist/scripts/'))
          .on('error', plugins.util.log);
});

gulp.task('scripts-game', [], function() {
  return gulp.src(['src/game/**/plugins/**/*.js', 'src/game/**/*.js'])
          .pipe(newer('dist/scripts/game.min.js'))
          //.pipe(plugins.eslint())
          //.pipe(plugins.eslint.format())
          .pipe(plugins.concat('game.min.js'))
          .pipe(plugins.sourcemaps.init())
          .pipe(plugins.uglify().on('error', plugins.util.log))
          .pipe(plugins.sourcemaps.write('../maps/'))
          .pipe(gulp.dest('dist/scripts/'))
          .on('error', plugins.util.log);
});

gulp.task('scripts-third-party', ['scripts-bower', 'scripts-blockly', 'scripts-melonjs', 'scripts-acorn']);

gulp.task('scripts-bower', [], function() {
  return gulp.src(mainBowerFiles())
          .pipe(plugins.filter("**/*.js"))
          .pipe(newer('dist/scripts/bower.min.js'))
          .pipe(plugins.flatten())
          .pipe(plugins.concat('bower.min.js'))
          .pipe(plugins.sourcemaps.init())
          .pipe(plugins.uglify().on('error', plugins.util.log))
          .pipe(plugins.sourcemaps.write('../maps/'))
          .pipe(gulp.dest('dist/scripts/'))
          .on('error', plugins.util.log);
});

gulp.task('scripts-blockly', [], function() {
  return gulp.src([
            'third-party/ardublockly/blockly/blockly_compressed.js',
            'third-party/ardublockly/blockly/blocks_compressed.js',
            'third-party/ardublockly/blockly/arduino_compressed.js',
            'third-party/ardublockly/blockly/javascript_compressed.js',
            'third-party/ardublockly/blockly/msg/js/es.js',
          ])
          .pipe(newer('dist/scripts/blockly.min.js'))
          .pipe(plugins.flatten())
          .pipe(plugins.concat('blockly.min.js'))
          .pipe(plugins.sourcemaps.init())
          .pipe(plugins.uglify().on('error', plugins.util.log))
          .pipe(plugins.sourcemaps.write('../maps/'))
          .pipe(gulp.dest('dist/scripts/'))
          .on('error', plugins.util.log);
});

gulp.task('scripts-melonjs', [], function() {
  return gulp.src([
            'third-party/melonjs/melonJS.js',
            'third-party/melonjs/plugins/**/*.js'
          ])
          .pipe(newer('dist/scripts/melonjs.min.js'))
          .pipe(plugins.flatten())
          .pipe(plugins.concat('melonjs.min.js'))
          .pipe(plugins.sourcemaps.init())
          .pipe(plugins.uglify().on('error', plugins.util.log))
          .pipe(plugins.sourcemaps.write('../maps/'))
          .pipe(gulp.dest('dist/scripts/'))
          .on('error', plugins.util.log);
});

gulp.task('bundle-melonjs-resources', [], function() {
  return gulp.src('src/game/data/**/*')
          // .pipe(newer('dist/scripts/resources.min.js'))
          .pipe(plugins.flatten())
          .pipe(bundleMelonJSResources('resources.min.js', 'assets/game/'))
          .pipe(plugins.sourcemaps.init())
          .pipe(plugins.uglify().on('error', plugins.util.log))
          .pipe(plugins.sourcemaps.write('../maps/'))
          .pipe(gulp.dest('dist/scripts/'))
          .on('error', plugins.util.log);
});

gulp.task('scripts-acorn', [], function() {
  return gulp.src([
            'third-party/acorn/acorn.js',
            'third-party/acorn/interpreter.js'
          ])
          .pipe(newer('dist/scripts/acorn.min.js'))
          .pipe(plugins.flatten())
          .pipe(plugins.concat('acorn.min.js'))
          .pipe(plugins.sourcemaps.init())
          .pipe(plugins.uglify().on('error', plugins.util.log))
          .pipe(plugins.sourcemaps.write('../maps/'))
          .pipe(gulp.dest('dist/scripts/'))
          .on('error', plugins.util.log);
});
