"use strict";

this.Home = (function() {

  var module = {};

  var homeNavbarCollapseElement = null;
  var homeContentElement = null;
  var homeBlocklyWrapperElement = null;
  var homeSimulatorWrapperElement = null;
  var mapsModalElement = null;
  var homeSimulatorCanvasMinified = true;
  var homeSimulatorCanvasMinifiedTop = null;
  var homeSimulatorCanvasMinifiedLeft = null;
  
  module.initialize = function() {
    console.log("Initialized has been executed");
    var navbarPromise = HomeNavbar.initialize();
    var simulatorPromise = HomeSimulator.initialize();
    var blocklyPromise = HomeBlockly.initialize();
    var configPromise = Config.initialize();

    $.material.init();
    homeNavbarCollapseElement = $('#home-navbar-collapse');
    homeContentElement = $("#home-content");
    homeBlocklyWrapperElement = $("#home-blockly-wrapper");
    homeSimulatorWrapperElement = $("#home-simulator-wrapper");
    mapsModalElement = $("#maps-modal");
    
    module.setInitialLayoutMode();

    homeNavbarCollapseElement.on('shown.bs.collapse hidden.bs.collapse', HomeBlockly.forceBlocklySvgResize);
    homeSimulatorWrapperElement.click(module.toggleLayoutMode);
    window.addEventListener('orientationchange', module.resetDraggablePosition, false);

    $("#maps-modal .media").click(module.onMapSelectionClick);
  }

  module.setInitialLayoutMode = function() {
    if (_.contains(["xs", "sm"], StateIndicator.getState())) {
      module.setLayoutModeCollapsed();
    } else { /* ["md", "lg"] */
      module.setLayoutModeExpanded();
    }
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
  
  module.toggleLayoutMode = function() {
    if (homeContentElement.hasClass('content-expanded')) {
      module.setLayoutModeCollapsed();
    } else {
      module.setLayoutModeExpanded();
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
      module.enableSimulatorDragging();
    }
  }

  module.showMapsModal = function() {
    mapsModalElement.modal('show');
  }

  module.onMapSelectionClick = function () {
    var selectedMap = $(this).attr("id");
    // Hide map selection modal.
    mapsModalElement.modal('hide');
    HomeNavbar.toggleNavbar();
    // If there is no code in workspace, change map. Otherwise, ask for confirmation first.
    var code = Blockly.JavaScript.workspaceToCode(HomeBlockly.workspace);
    if (!code || !code.trim().length) {
      module.onMapChange(selectedMap);
    } else {
      bootbox.dialog({
        message: "Un cambio de mapa eliminará el código existente. Querés continuar?",
        title: "Cambiar Mapa",
        buttons: {
          default: {
            label: "Cancelar",
            className: "btn-default"
          },
          success: {
            label: "Cambiar mapa",
            className: "btn-success",
            callback: function() {
              module.onMapChange(selectedMap);
            }
          }
        }
      });
    }
  }
  
  module.onMapChange = function(selectedMap) {
    HomeSimulator.changeMap(selectedMap);
    HomeBlockly.workspace.clear();
  }

  return module;

})();
