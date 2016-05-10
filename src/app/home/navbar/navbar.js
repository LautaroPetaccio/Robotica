"use strict";

this.NavbarM = (function() {
    
    var module = {};

    module.initialize = function() {
      $('#btn_run').click(function() {
        if(me.interpreter !== null && me.execution.isPaused()) { 
          // Resume
          me.execution.run();
          console.log("State: " + me.execution.state);
        }
        else {
          me.state.change(me.state.PLAY);
          var code = Blockly.JavaScript.workspaceToCode(BlocklyM.workspace);
          console.log(code);
          var onCompleted = function() {
            $('#btn_run').show();
            $('#btn_pause').hide();
            $('#btn_stop').hide();
          }
          me.execution.onCompleted = onCompleted;
          me.interpreter = new Interpreter(code, initApi);
          $('#btn_pause').show();
          $('#btn_stop').show();
          me.execution.run();
          console.log("State: " + me.execution.state);
        }
        $('#btn_run').hide();
      });

      $('#btn_pause').click(function() {
        $('#btn_run').show();
        me.execution.pause();
        console.log("State: " + me.execution.state);
      });

      $('#btn_stop').click(function() {
        $('#btn_run').show();
        $('#btn_pause').hide();
        $('#btn_stop').hide();
        me.execution.finish();
        console.log("State after stop: 1 " + me.execution.state);
        me.state.change(me.state.PLAY);
        console.log("State after stop: 2 " + me.execution.state);
      });
      
    }

    return module;

    /* Helpers */
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
    }
})();
