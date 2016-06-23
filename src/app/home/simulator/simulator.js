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

  module.pause = function(onPause) {
    if(me.execution.isRunning()) {
      onPause();
      me.execution.pause();
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
      me.interpreter = new Interpreter(code, initApi);
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

  function initApi(interpreter, scope) {
    interpreter.robotInstructions = new Array();
    interpreter.robotSensors = {left : 0,
                                right: 0,
                                front: 0,
                                back : 0};
    /* Add an API function for the motor function */
    var wrapper = function(leftWheelValue, rightWheelValue, durationValue) {
      if (leftWheelValue.data < -100 || leftWheelValue.data > 100) {
        leftWheelValue.data = Math.max(-100, Math.min(100, leftWheelValue.data));
        module.notifySaturationLeftWheel();
      }
      if (rightWheelValue.data < -100 || rightWheelValue.data > 100) {
        rightWheelValue.data = Math.max(-100, Math.min(100, rightWheelValue.data));
        module.notifySaturationRightWheel();
      }
      return interpreter.createPrimitive(
        interpreter.robotInstructions.push(
          {action : 'motor', 
          leftWheel : leftWheelValue.data,
          rightWheel : rightWheelValue.data,
          duration : durationValue.data
          })
      );
    };
    interpreter.setProperty(scope, 'motor',
        interpreter.createNativeFunction(wrapper));

    /* Add an API function for the sensor function */
    wrapper = function(sensorName, callback) {
      interpreter.robotInstructions.push({
        action : 'sensor',
        sensorName : sensorName,
        sensorResultCallback : callback
      });
    };
    interpreter.setProperty(scope, 'sensor',
        interpreter.createAsyncFunction(wrapper));

    /* Add an API function for the tracer enabler */
    wrapper = function(enabled) {
      interpreter.robotInstructions.push(
        {action : 'tracer_status', 
          enabled: enabled
        });
      return interpreter.createPrimitive(null);
    };
    interpreter.setProperty(scope, 'tracer',
        interpreter.createNativeFunction(wrapper));

    /* Add an API function for the tracer colour */
    wrapper = function(colour) {
      interpreter.robotInstructions.push(
        {action : 'tracer_colour', 
          colour: colour
        })
      return interpreter.createPrimitive(null);
    };
    interpreter.setProperty(scope, 'tracer_colour',
        interpreter.createNativeFunction(wrapper));

    wrapper = function(text) {
      console.log("Console log: ");
      console.log(text.data);
      return interpreter.createPrimitive(null);
    };
    interpreter.setProperty(scope, 'console_log',
        interpreter.createNativeFunction(wrapper));

  }

  return module;

})();
