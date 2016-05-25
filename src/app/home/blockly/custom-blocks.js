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
          .appendField("Duración");
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
    var code = 'sensor(\'' + dropdown_sensor + '\')';
    // return code;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };

  /* Enables or disables tracing support */
  Blockly.Blocks['robotica_tracer_status'] = {
    init: function() {
      this.appendValueInput("enable")
          .setCheck("Boolean")
          .appendField("Traza habilitada");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(65);
      this.setTooltip('');
      this.setHelpUrl('http://www.example.com/');
    }
  };

  Blockly.JavaScript['robotica_tracer_status'] = function(block) {
    var value_enable = Blockly.JavaScript.valueToCode(block, 'enable', Blockly.JavaScript.ORDER_ATOMIC);
    var code = 'tracer(' + value_enable + ');\n';
    return code;
  };

  /* Sets tracer's colour */
  Blockly.Blocks['robotica_tracer_colour'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Color de traza")
          .appendField(new Blockly.FieldColour("#ff0000"), "trace_colour");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(65);
      this.setTooltip('');
      this.setHelpUrl('http://www.example.com/');
    }
  };

  Blockly.JavaScript['robotica_tracer_colour'] = function(block) {
    var trace_colour = block.getFieldValue('trace_colour');
    var code = 'tracer_colour(\''+ trace_colour +'\');\n';
    return code;
  };

  /* Just for debugging */
  Blockly.Blocks['console_log'] = {
    init: function() {
      this.appendValueInput("text")
          .setCheck(null)
          .appendField("Texto");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(20);
      this.setTooltip('');
      this.setHelpUrl('http://www.example.com/');
    }
  };

  Blockly.JavaScript['console_log'] = function(block) {
    var value_text = Blockly.JavaScript.valueToCode(block, 'text', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = 'console_log(' + value_text + ');\n';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };

})();


