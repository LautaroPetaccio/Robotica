"use strict";

this.HomeM = (function() {

  var module = {};

  module.initialize = function() {
    /* Render view */
    IndexM.loadPage("home", function() {
      IndexM.loadPartial("#home-navbar-wrapper", "navbar", function() {
        NavbarM.initialize();
      });
      IndexM.loadPartial("#home-simulator-wrapper", "simulator", function() {
        SimulatorM.initialize();
      });
      IndexM.loadPartial("#home-blockly-wrapper", "blockly", function() {
        IndexM.loadPartial("#blockly-toolbox-wrapper", "toolbox", function() {
          BlocklyM.initialize();
        });
      });
    });
  }

  return module;

})();

HomeM.initialize();
