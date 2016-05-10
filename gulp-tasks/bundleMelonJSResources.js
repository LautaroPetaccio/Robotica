/* Imports */
var plugins = require('gulp-load-plugins')(['gulp-*']);
var jsonString = require('json-string');
var microMatch = require('micromatch');
var path = require('path');
var through = require('through2');

module.exports = function(resourcesFilePath, assetsDirectory) {
  var resources = [];

  function bufferContents(file, encoding, callback) {
    var filePath = file.history[0];
    var resourceName = path.basename(filePath, path.extname(filePath));
    var resourceSource = path.join(assetsDirectory, path.basename(filePath));
    if (microMatch.isMatch(filePath, '**/{bgm,sfx}/**/*')) {
      resources.push({name: resourceName, src: resourceSource, type: "audio"});
    }
    if (microMatch.isMatch(filePath, '**/img/**/*.png')) {
      resources.push({name: resourceName, src: resourceSource, type: "image"});
    }
    if (microMatch.isMatch(filePath, '**/img/**/*.json')) {
      resources.push({name: resourceName, src: resourceSource, type: "json"});
    }
    if (microMatch.isMatch(filePath, '**/map/**/*.{tmx,json}')) {
      resources.push({name: resourceName, src: resourceSource, type: "tmx"});
    }
    if (microMatch.isMatch(filePath, '**/map/**/*.tsx')) {
      resources.push({name: resourceName, src: resourceSource, type: "tsx"});
    }
    callback();
  }

  function endStream(callback) {
    var resourcesFileContents = 'game.resources = ' + jsonString(resources);
    var resourcesFile = new plugins.util.File({
      path: resourcesFilePath,
      contents: new Buffer(resourcesFileContents)
    });
    this.push(resourcesFile);
    callback();
  }
  return through.obj(bufferContents, endStream);
};
