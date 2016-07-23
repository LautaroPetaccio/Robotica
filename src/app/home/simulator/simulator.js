"use strict";

this.HomeSimulator = (function() {

  var module = {};

  module.render = function(selector) {
    return Views.loadView("simulator", selector)
        .then(module.initialize);
  }

  module.initialize = function() {
    /* Load melonjs game. */
    me.interpreter = null;
    game.onload("simulator-screen");

    // Mobile browser hacks
    if (me.device.isMobile && !navigator.isCocoonJS) {
        // Prevent the webview from moving on a swipe
        window.document.addEventListener("touchmove", function (e) {
            e.preventDefault();
            window.scroll(0, 0);
            return false;
        }, false);
        // Scroll away mobile GUI
        (function () {
            window.scrollTo(0, 1);
            me.video.onresize(null);
        }).defer();
        me.event.subscribe(me.event.WINDOW_ONRESIZE, function (e) {
            window.scrollTo(0, 1);
        });
    }
    
    window.addEventListener('resize', module.onContainerResize, false);
    module.onContainerResize();
  }

  module.onContainerResize = function() {
    var screenElement = $("#simulator-screen");
    var canvasElement = $("#simulator-screen > canvas");
    var screenWrapperElement = screenElement.parent();
    var screenWrapperWidth = screenWrapperElement.width();
    var screenWrapperHeight = screenWrapperElement.height();
    var screenWidth = Math.min(screenWrapperWidth, screenWrapperHeight);
    var screenHeight = screenWidth;
    screenElement.width(screenWidth);
    screenElement.height(screenHeight);
    canvasElement.width(screenWidth);
    canvasElement.height(screenHeight);
  }

  module.onWorkspaceChange = function(event) {
    if(event.type == Blockly.Events.CHANGE || 
      event.type == Blockly.Events.CREATE || 
      event.type == Blockly.Events.DELETE) {
      /* If the code was modified, finish the execution */
      me.execution.finish();
      /* Remove the event listener */
      HomeBlockly.workspace.removeChangeListener(module.onWorkspaceChange);
    }
  }

  module.changeMap = function(selectedMap) {
    me.game.changeMap(selectedMap);
  }

  module.pause = function(onPause) {
    if(me.execution.isRunning()) {
      onPause();
      me.execution.pause();
      /* While being paused, check if the code was modified */
      HomeBlockly.workspace.addChangeListener(module.onWorkspaceChange);
    }
  }

  module.stop = function(onStop) {
    if(!me.execution.hasFinished()) {
      onStop();
      me.execution.finish();
      me.state.change(me.state.PLAY);
    }
  }

  module.run = function(onRun, onCompleted) {
    if(me.execution.hasFinished()) {
      var code = Blockly.JavaScript.workspaceToCode(HomeBlockly.workspace);
      if(!code.length) {
        module.notifyEmptyProgram();
        return;
      }
      me.state.pause();
      me.state.change(me.state.PLAY);
      me.execution.onCompleted = onCompleted;
      me.interpreter = SimulatorInterpreter.createInterpreter(code);
      me.state.resume();
    }
    if(!me.execution.isRunning()) {
      onRun();
      me.execution.run();
    }
  }

  module.notifyEmptyProgram = _.throttle(function() {
    toastr.info('No hay código para ejecutar.', 'Programa vacío', {timeOut: 2000});
  }, 3000, {trailing: false});

  module.notifySaturationLeftWheel = _.throttle(function() {
    notifySaturation('La potencia de la rueda izquierda está fuera del rango [-100, 100].');
  }, 3000, {trailing: false});

  module.notifySaturationRightWheel = _.throttle(function() {
    notifySaturation('La potencia de la rueda derecha está fuera del rango [-100, 100].');
  }, 3000, {trailing: false});

  function notifySaturation(mensaje) {
    toastr.warning(mensaje, 'Potencia fuera de límite', {timeOut: 2000});
  }

  return module;

})();
