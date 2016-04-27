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
