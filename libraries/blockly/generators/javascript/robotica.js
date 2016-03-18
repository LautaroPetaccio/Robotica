'use strict';

goog.require('Blockly.JavaScript');

Blockly.JavaScript['robotica_motor'] = function(block) {
  // Search the text for a substring.
  var value_leftwheel = Blockly.JavaScript.valueToCode(block, 'leftWheel', Blockly.JavaScript.ORDER_ATOMIC);
  var value_rightwheel = Blockly.JavaScript.valueToCode(block, 'rightWheel', Blockly.JavaScript.ORDER_ATOMIC);
  var value_motorpower = Blockly.JavaScript.valueToCode(block, 'motorPower', Blockly.JavaScript.ORDER_ATOMIC);
  var code = "motor(" + value_leftwheel + ' , ' + value_rightwheel + ' , ' + value_motorpower + ');\n';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['robotica_sensor'] = function(block) {
  var dropdown_sensor = block.getFieldValue('Sensor');
  var code = 'sensor(' + dropdown_sensor + ')';
  return [code, Blockly.JavaScript.ORDER_NONE];
};