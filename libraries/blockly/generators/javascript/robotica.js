'use strict';

goog.require('Blockly.JavaScript');

Blockly.JavaScript['robotica_motor'] = function(block) {
  var value_leftwheel = Blockly.JavaScript.valueToCode(block, 'leftWheel', Blockly.JavaScript.ORDER_ATOMIC);
  var value_rightwheel = Blockly.JavaScript.valueToCode(block, 'rightWheel', Blockly.JavaScript.ORDER_ATOMIC);
  var value_duration = Blockly.JavaScript.valueToCode(block, 'duration', Blockly.JavaScript.ORDER_ATOMIC);
  var code = "motor(" + value_leftwheel + ' , ' + value_rightwheel + ' , ' + value_duration + ');\n';
  return code;
};

Blockly.JavaScript['robotica_sensor'] = function(block) {
  var dropdown_sensor = block.getFieldValue('Sensor');
  var code = 'sensor(' + dropdown_sensor + ')';
  return code;
};

Blockly.JavaScript['robotica_tracer_status'] = function(block) {
  var value_enable = Blockly.JavaScript.valueToCode(block, 'enable', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'tracer(' + value_enable + ');\n';
  return code;
};

Blockly.JavaScript['robotica_tracer_colour'] = function(block) {
  var trace_colour = block.getFieldValue('trace_colour');
  var code = 'tracer_colour(\''+ trace_colour +'\');\n';
  return code;
};