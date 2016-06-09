"use strict";

this.Home = (function() {

  var module = {};

  var homeNavbarCollapseElement = null;
  var homeContentElement = null;
  var homeBlocklyWrapperElement = null;
  var homeSimulatorWrapperElement = null;
  var mapsModalElement = null;

  module.render = function(selector) {
    return Views.loadView("home", selector)
        .then(module.renderSubviews)
        .then(module.initialize);
  }

  module.renderSubviews = function() {
    var navbarPromise = HomeNavbar.render("#home-navbar-wrapper");
    var simulatorPromise = HomeSimulator.render("#home-simulator-wrapper");
    var blocklyPromise = HomeBlockly.render("#home-blockly-wrapper");
    var mapsModalPromise = Views.loadView("maps-modal", "#maps-modal-wrapper");
    return Q.all([navbarPromise, simulatorPromise, blocklyPromise, mapsModalPromise]);
  }
  
  module.initialize = function() {
    homeNavbarCollapseElement = $('#home-navbar-collapse');
    homeContentElement = $("#home-content");
    homeBlocklyWrapperElement = $("#home-blockly-wrapper");
    homeSimulatorWrapperElement = $("#home-simulator-wrapper");
    mapsModalElement = $("#maps-modal");
    
    module.setInitialLayoutMode();

    homeNavbarCollapseElement.on('shown.bs.collapse hidden.bs.collapse', HomeBlockly.forceBlocklySvgResize);
    homeSimulatorWrapperElement.click(module.toggleLayoutMode);
    window.addEventListener('resize', module.setInitialLayoutMode, false);
    window.addEventListener('orientationchange', module.resetDraggablePosition, false);

    $("#maps-modal .media").click(module.onMapSelectionClick);

    $(document).keydown(module.keyShortcut);
  }
  
  module.keyShortcut = function(event) {
    if(navigator.appVersion.indexOf("Mac") != -1) {
      if(!event.metaKey) return true;
    }
    else
      if(!event.ctrlKey) return true;

    if(event.which == 83) {
      HomeBlockly.saveProgram();
      event.preventDefault();
      event.stopPropagation();
    }
    if(event.which == 79) {
      HomeBlockly.loadProgram();
      event.preventDefault();
      event.stopPropagation();
    }
    if(event.which == 82) {
      if(!me.execution.isRunning())
        $('#btn_run').trigger("click");
      event.preventDefault();
      event.stopPropagation();
    }
    if(event.which == 80) {
      if(me.execution.isRunning())
        $('#btn_pause').trigger("click");
      event.preventDefault();
      event.stopPropagation();
    }
  }

  module.setInitialLayoutMode = function() {
    if (_.contains(["xs", "sm"], StateIndicator.getState())) {
      module.setLayoutModeCollapsed();
    } else { /* ["md", "lg"] */
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

  module.showMapsModal = function() {
    mapsModalElement.modal('show');
  }

  module.onMapSelectionClick = function () {
    me.game.changeMap($(this).attr("id"));
    mapsModalElement.modal('hide');
    HomeNavbar.toggleNavbar();
  }
  
  return module;

})();
