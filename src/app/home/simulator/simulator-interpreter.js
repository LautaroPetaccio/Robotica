"use strict";

this.SimulatorInterpreter = (function() {
  
  var module = {};

  module.createInterpreter = function(code) {
    return new Interpreter(code, initApi);
  }

  function initApi(interpreter, scope) {
    interpreter.robotInstructions = new Array();

    /* Add an API function for the motor function */
    var motorWrapper = function(leftWheelValue, rightWheelValue, durationValue) {
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

    /* Add an API function for the sensor function */
    var sensorWrapper = function(sensorName, callback) {
      interpreter.robotInstructions.push({
        action : 'sensor',
        sensorName : sensorName,
        sensorResultCallback : callback
      });
    };

    /* Add an API function for the tracer enabler */
    var tracerEnableWrapper = function(enabled) {
      interpreter.robotInstructions.push(
        {action : 'tracer_status', 
          enabled: enabled
        });
      return interpreter.createPrimitive(null);
    };

    /* Add an API function for the tracer colour */
    var tracerColourWrapper = function(colour) {
      interpreter.robotInstructions.push(
        {action : 'tracer_colour', 
          colour: colour
        })
      return interpreter.createPrimitive(null);
    };

    var consoleLogWrapper = function(text) {
      console.log("Console log: ");
      console.log(text.data);
      return interpreter.createPrimitive(null);
    };

    interpreter.setProperty(scope, 'sensor',
        interpreter.createAsyncFunction(sensorWrapper));
    interpreter.setProperty(scope, 'motor',
        interpreter.createNativeFunction(motorWrapper));
    interpreter.setProperty(scope, 'console_log',
        interpreter.createNativeFunction(consoleLogWrapper));
    interpreter.setProperty(scope, 'tracer_colour',
        interpreter.createNativeFunction(tracerColourWrapper));
    interpreter.setProperty(scope, 'tracer',
        interpreter.createNativeFunction(tracerEnableWrapper));
  }

  return module;

})();