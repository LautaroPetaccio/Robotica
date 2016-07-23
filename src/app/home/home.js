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
    var configPromise = Config.render("#home-config-wrapper");
    return Q.all([navbarPromise, simulatorPromise, blocklyPromise, mapsModalPromise, configPromise]);
  }
  
  module.initialize = function() {
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
    if (_.contains(["xs", "sm"], StateIndicator.getState())) {
      if (homeSimulatorCanvasMinified) {

        if (homeSimulatorCanvasMinifiedTop == null) {
          homeSimulatorWrapperElement.css({
            top: homeSimulatorWrapperElement.position().top,
            left: homeSimulatorWrapperElement.position().left
          });
        }
        homeSimulatorCanvasMinifiedTop = homeSimulatorWrapperElement.position().top;
        homeSimulatorCanvasMinifiedLeft = homeSimulatorWrapperElement.position().left;

        homeSimulatorWrapperElement.find("#simulator-screen, canvas").css({
          width: '100%',
          height: '100%'
        });
        homeSimulatorWrapperElement.stop().animate({
          top: '20px',
          left: '15%'
        }, 250, function() {
            homeSimulatorWrapperElement.stop().animate({
              width: '650px',
              height: '583px'
            }, 500, function() {});
        });
        homeSimulatorCanvasMinified = false;

      } else {

        homeSimulatorWrapperElement.stop().animate({
          width: '100px',
          height: '100px'
        }, 500, function() {
            homeSimulatorWrapperElement.stop().animate({
              top: homeSimulatorCanvasMinifiedTop,
              left: homeSimulatorCanvasMinifiedLeft
            }, 250, function() {});
        });
        homeSimulatorCanvasMinified = true;

      }
    } else {
      if (homeContentElement.hasClass('content-collapsed')) {
        module.setLayoutModeExpanded();
      } else {
        module.setLayoutModeCollapsed();
      }
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
