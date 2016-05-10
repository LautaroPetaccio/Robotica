"use strict";

(function() {

    Blockly.Blocks['robotica_motor'] = {
      init: function() {
        this.appendValueInput("leftWheel")
            .setCheck("Number")
            .appendField("Rueda izquierda");
        this.appendValueInput("rightWheel")
            .setCheck("Number")
            .appendField("Rueda derecha");
        this.appendValueInput("duration")
            .setCheck("Number")
            .appendField("Duracion");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(65);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    };

    Blockly.JavaScript['robotica_motor'] = function(block) {
      var value_leftwheel = Blockly.JavaScript.valueToCode(block, 'leftWheel', Blockly.JavaScript.ORDER_ATOMIC);
      var value_rightwheel = Blockly.JavaScript.valueToCode(block, 'rightWheel', Blockly.JavaScript.ORDER_ATOMIC);
      var value_duration = Blockly.JavaScript.valueToCode(block, 'duration', Blockly.JavaScript.ORDER_ATOMIC);
      var code = "motor(" + value_leftwheel + ' , ' + value_rightwheel + ' , ' + value_duration + ');\n';
      return code;
    };

    Blockly.Blocks['robotica_sensor'] = {
      init: function() {
        this.appendDummyInput()
            .appendField("Sensor")
            .appendField(new Blockly.FieldDropdown([["Izquierda", "left"], ["Derecha", "right"], ["Adelante", "front"], ["Atrás", "back"]]), "Sensor");
        this.setOutput(true, "Number");
        this.setColour(65);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    };

    Blockly.JavaScript['robotica_sensor'] = function(block) {
      var dropdown_sensor = block.getFieldValue('Sensor');
      var code = 'sensor(' + dropdown_sensor + ')';
      return code;
    };

})();


