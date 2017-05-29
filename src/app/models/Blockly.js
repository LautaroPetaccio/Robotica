"use strict";

this.app = app || {};

this.app.models = app.models || {};

this.app.models.Blockly = Backbone.Model.extend({
  defaults: {},

  initialize: function() {

  },

  exportWorkspaceXml : function() {
    var xmlDom = Blockly.Xml.workspaceToDom(this.get('workspace'));
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    return xmlText;
  },

  addWorkspaceOnChangeListener : function(onChange) {
    this.get('workspace').addChangeListener(onChange);
  },

  removeWorkspaceOnChangeListener : function(onChange) {
    this.get('workspace').removeChangeListener(onChange);
  },

  addArduinoFooter : function(code) {
    code = code.slice(0, -1);
    code += "  while(true) {\n    delay(1000);\n  }\n}";
    return code;
  },

  /* TODO Add header */
  addArduinoHeader : function (code) {
    return code;
  },

  exportWorkspaceArduino : function() {
    var code = Blockly.Arduino.workspaceToCode(this.get('workspace'));
    code = this.addArduinoFooter(code);
    return code;
  },

  exportWorkspaceJavascript : function() {
    return Blockly.JavaScript.workspaceToCode(this.get('workspace'));
  },

  importWorkspaceXml : function(xmlText) {
    this.get('workspace').clear();
    var xmlDom = Blockly.Xml.textToDom(xmlText);
    Blockly.Xml.domToWorkspace(xmlDom, this.get('workspace'));
  },

  codeIsEmpty : function() {
    var code = Blockly.JavaScript.workspaceToCode(this.get('workspace'));
    return !code || !code.trim().length
  },

  clearWorkspace : function() {
    this.get('workspace').clear();
  }
});