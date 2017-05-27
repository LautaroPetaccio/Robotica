"use strict";

var app = app || {};

this.Index = (function() {

  var module = {};

  module.run = function() {
    var pageWrapperSelector = "#page-wrapper";
    Home.initialize();
  }

  return module;

})();

$(document).ready(function() {
  Index.run();
});

// $("#app").load(function() {
//   Index.run();
// });
