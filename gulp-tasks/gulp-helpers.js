var glob = require("glob");
var path = require("path");
var fs = require("fs");

module.exports = {
  generateMapsData : function() {
    var result = [];
    var files = glob.sync("src/game/data/map/**/*.tmx");
    for(var i = 0; i < files.length; i++) {
      var filePath = path.parse(files[i]);
      var confFilePath = path.join(filePath.dir, filePath.name + ".conf");
      var mapData = JSON.parse(fs.readFileSync(confFilePath, 'utf8'));
      var mapName = filePath.name;
      var mapTitle = mapData.title;
      var mapDescription = mapData.description;
      result.push({ "name" : mapName, "title" : mapTitle, "description" : mapDescription });
    }
    return result;
  }
}