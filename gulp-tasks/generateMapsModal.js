var swig  = require('swig');
var plugins = require('gulp-load-plugins')(['gulp-*']);
var path = require('path');
var through = require('through2');
var fs = require('fs');

module.exports = function(modalTemplatePath, thumbnailsDirectory) {
  var maps = [];

  function bufferContents(file, encoding, callback) {
    var filePath = path.parse(file.history[0]);
    var confFilePath = path.join(filePath.dir, filePath.name + ".conf");
    var mapData = JSON.parse(fs.readFileSync(confFilePath, 'utf8'));

    var mapName = filePath.name;
    var mapTitle = mapData.title;
    var mapDescription = mapData.description;

    maps.push({ "name" : mapName, "title" : mapTitle, "description" : mapDescription })

    callback();
  }
  
  function endStream(callback) {
  	var renderedTemplate = swig.renderFile(modalTemplatePath, { 
  		"maps" : maps, 
  		"thumbnailsDirectory" : thumbnailsDirectory
  	});
    var resourcesFile = new plugins.util.File({
      path: "maps-modal.html",
      contents: new Buffer(renderedTemplate)
    });
    this.push(resourcesFile);
    callback();
  }
  return through.obj(bufferContents, endStream);
}