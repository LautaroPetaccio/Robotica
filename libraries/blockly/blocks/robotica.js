'use strict';

//goog.provide('Blockly.Blocks.logic');

goog.require('Blockly.Blocks');


Blockly.Blocks['robotica_motor'] = {
  init: function() {
    this.appendValueInput("leftWheel")
        .setCheck("Number")
        .appendField("Rueda izquierda");
    this.appendValueInput("rightWheel")
        .setCheck("Number")
        .appendField("Rueda derecha");
    this.appendValueInput("motorPower")
        .setCheck("Number")
        .appendField("Fuerza");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['robotica_sensor'] = {
  init: function() {
    this.appendValueInput("sensorNumber")
        .setCheck("Number")
        .appendField("Sensor");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(210);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};