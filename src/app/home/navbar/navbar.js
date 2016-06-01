"use strict";

this.HomeNavbar = (function() {
  
  var module = {};

  module.render = function(selector) {
    return Views.loadView("navbar", selector).then(function() {
      module.initialize();
    });
  }

  module.initialize = function() {

    $('#btn_run').click(function(event) {
      if(me.interpreter !== null && me.execution.isPaused()) { 
        // Resume
        $('#btn_pause').show();
        me.execution.run();
      }
      else {
        var code = Blockly.JavaScript.workspaceToCode(HomeBlockly.workspace);
        if(!code.length) {
          module.notifyEmptyProgram();
          return;
        }
        me.state.pause();
        me.state.change(me.state.PLAY);
        var onCompleted = function() {
          $('#btn_run').show();
          $('#btn_pause').hide();
          $('#btn_stop').hide();
        }
        me.execution.onCompleted = onCompleted;
        me.interpreter = new Interpreter(code, initApi);
        $('#btn_pause').show();
        $('#btn_stop').show();
        me.state.resume();
        me.execution.run();
      }
      $('#btn_run').hide();
      event.stopPropagation();
    });
    $('#btn_pause').click(function(event) {
      $('#btn_run').show();
      $('#btn_pause').hide();
      me.execution.pause();
    });
    $('#btn_stop').click(function(event) {
      $('#btn_run').show();
      $('#btn_pause').hide();
      $('#btn_stop').hide();
      me.execution.finish();
      me.state.change(me.state.PLAY);
    });

    $('#btn_save').click(function() {
      HomeBlockly.saveProgram();
    });
    
    $('#btn_load').click(function() {
      HomeBlockly.loadProgram();
    });
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

})();
