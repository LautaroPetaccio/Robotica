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
          return;
        }
        me.state.change(me.state.PLAY);
        var onCompleted = function() {
          $('#btn_run').show();
          $('#btn_pause').hide();
          $('#btn_stop').hide();
        }
        me.execution.onCompleted = onCompleted;
        console.log(code);
        me.interpreter = new Interpreter(code, initApi);
        $('#btn_pause').show();
        $('#btn_stop').show();
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
  }

  return module;

  function initApi(interpreter, scope) {
    interpreter.robotInstructions = new Array();
    interpreter.robotSensors = {left : 0,
                                right: 0,
                                front: 0,
                                back : 0};
    // Add an API function for the motor function
    var wrapper = function(leftWheelValue, rightWheelValue, durationValue) {
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
    // Add an API function for the sensor function
    wrapper = function(sensorName) {
      return interpreter.createPrimitive(interpreter.robotSensors[sensorName]);
    };
    interpreter.setProperty(scope, 'sensor',
        interpreter.createNativeFunction(wrapper));

    // Add an API function for the tracer enabler
    wrapper = function(enabled) {
      interpreter.robotInstructions.push(
        {action : 'tracer_status', 
          enabled: enabled
        })
      return interpreter.createPrimitive(null);
    };
    interpreter.setProperty(scope, 'tracer',
        interpreter.createNativeFunction(wrapper));

    // Add an API function for the tracer colour
    wrapper = function(colour) {
      interpreter.robotInstructions.push(
        {action : 'tracer_colour', 
          colour: colour
        })
      return interpreter.createPrimitive(null);
    };
    interpreter.setProperty(scope, 'tracer_colour',
        interpreter.createNativeFunction(wrapper));

  }

})();
