"use strict";

this.Index = (function() {

  var module = {};

  module.run = function() {
    var pageWrapperSelector = "#page-wrapper";
    Home.render(pageWrapperSelector);
  }

  return module;

})();

$("#app").load(function() {
  Index.run();
});
