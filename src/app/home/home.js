"use strict";

this.Home = (function() {

  var module = {};

  var homeNavbarCollapseElement = null;
  var homeContentElement = null;
  var homeBlocklyWrapperElement = null;
  var homeSimulatorWrapperElement = null;


  module.render = function(selector) {
    return Views.loadView("home", selector).then(function() {
      var blocklyPromise = HomeBlockly.render("#home-blockly-wrapper");
      var navbarPromise = HomeNavbar.render("#home-navbar-wrapper");
      var simulatorPromise = HomeSimulator.render("#home-simulator-wrapper");
      return Q.all([navbarPromise, simulatorPromise, blocklyPromise]).then(function() {
        module.initialize();
      });
    });
  }
  
  module.initialize = function() {
    homeNavbarCollapseElement = $('#home-navbar-collapse');
    homeContentElement = $("#home-content");
    homeBlocklyWrapperElement = $("#home-blockly-wrapper");
    homeSimulatorWrapperElement = $("#home-simulator-wrapper");
    
    module.setInitialLayoutMode();

    homeNavbarCollapseElement.on('shown.bs.collapse hidden.bs.collapse', HomeBlockly.forceBlocklySvgResize);
    homeSimulatorWrapperElement.click(module.toggleLayoutMode);
    window.addEventListener('resize', module.setInitialLayoutMode, false);
    window.addEventListener('orientationchange', module.resetDraggablePosition, false);
  }
  
  module.setInitialLayoutMode = function() {
    if (_.contains(["xs", "sm", "md"], StateIndicator.getState())) {
      module.setLayoutModeCollapsed();
    } else {
      module.setLayoutModeExpanded();
    }
  }
  
  module.setLayoutModeExpanded = function() {
    homeContentElement.removeClass('content-collapsed');
    homeSimulatorWrapperElement.removeClass('simulator-collapsed');
    homeBlocklyWrapperElement.removeClass('blockly-collapsed');
    homeContentElement.addClass('content-expanded');
    homeSimulatorWrapperElement.addClass('simulator-expanded');
    homeBlocklyWrapperElement.addClass('blockly-expanded');
    module.disableSimulatorDragging();
    HomeSimulator.onContainerResize();
    HomeBlockly.onContainerResize();
  }
  
  module.setLayoutModeCollapsed = function() {
    homeContentElement.removeClass('content-expanded');
    homeSimulatorWrapperElement.removeClass('simulator-expanded');
    homeBlocklyWrapperElement.removeClass('blockly-expanded');
    homeContentElement.addClass('content-collapsed');
    homeSimulatorWrapperElement.addClass('simulator-collapsed');
    homeBlocklyWrapperElement.addClass('blockly-collapsed');
    module.enableSimulatorDragging();
    HomeSimulator.onContainerResize();
    HomeBlockly.onContainerResize();
  }
  
  module.toggleLayoutMode = function() {
    if (homeContentElement.hasClass('content-collapsed')) {
      module.setLayoutModeExpanded();
    } else {
      module.setLayoutModeCollapsed();
    }
  }

  module.enableSimulatorDragging = function() {
    homeSimulatorWrapperElement.draggable({ containment: "window" });
    homeSimulatorWrapperElement.draggable('enable');
  }
  
  module.disableSimulatorDragging = function() {
    homeSimulatorWrapperElement.draggable({ containment: "window" });
    homeSimulatorWrapperElement.draggable('disable');
    homeSimulatorWrapperElement.attr('style', '');
  }

  module.resetDraggablePosition = function() {
    if (homeContentElement.hasClass('content-collapsed')) {
      module.disableSimulatorDragging();
      homeSimulatorWrapperElement.animate({ top: "10px", right: "10px" });
      module.enableSimulatorDragging();
    }
  }
  
  return module;

})();
