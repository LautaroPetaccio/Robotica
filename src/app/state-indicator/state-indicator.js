"use strict";

this.StateIndicator = (function() {

  var module = {};

  module.initialize = function() {
    $("html").append('<div id="state-indicator"></div>');
  }

  module.getState = function() {
    var stateIndicatorElement = document.getElementById('state-indicator');
    var computedStyle = window.getComputedStyle(stateIndicatorElement, ':before');
    return computedStyle.getPropertyValue('content').replace(/"/g,'') || 'unknown';
  }

  return module;

})();

StateIndicator.initialize();
