"use strict";

this.HomeM = (function() {

  var module = {};

  module.initialize = function() {
    /* Render view */
    IndexM.loadPage("home", function() {
      IndexM.loadPartial("#home-navbar", "navbar", function() {
        NavbarM.initialize();
      });
      IndexM.loadPartial("#home-blockly", "blockly", function() {
        IndexM.loadPartial("#blockly-toolbox", "toolbox", function() {
          BlocklyM.initialize();
        });
      });
      IndexM.loadPartial("#home-simulator", "simulator", function() {
        SimulatorM.initialize();
      });
    });
  }

  return module;

})();

HomeM.initialize();
