"use strict";

this.app = app || {};

$(document).ready(function() {
  app.mapsSelectorView = new app.views.MapsSelectorView({el : '#maps-modal-wrapper'});

  app.configView = new app.views.ConfigView({el : '#home-config-wrapper'});

  app.navBarView = new app.views.NavBar({el: '#home-navbar-wrapper'});

  app.blocklyModel = new app.models.Blockly();
  app.blocklyView = new app.views.Blockly({el: '#home-blockly-wrapper', model: app.blocklyModel});

  app.downloadCodeModel = new app.models.FileSave({
    fileExtension : '.xml', 
    defaultFileName : 'xml-code',
    extractCode : $.proxy(app.blocklyModel.exportWorkspaceXml, app.blocklyModel)
  });
  app.downloadCodeView = new app.views.FileSave({el: '#download-code-modal-wrapper', model : app.downloadCodeModel});

  app.exportCodeModel = new app.models.FileSave({
    fileExtension : '.ino', 
    defaultFileName : 'arduino-code',
    extractCode : $.proxy(app.blocklyModel.exportWorkspaceArduino, app.blocklyModel)
  });
  app.exportCodeView = new app.views.FileSave({el: '#export-code-modal-wrapper', model : app.exportCodeModel});

  app.simulatorInterpreterModel = new app.models.SimulatorInterpreter();
  app.simulatorModel = new app.models.Simulator({interpreter : app.simulatorInterpreterModel});
  app.simulatorView = new app.views.Simulator({el : '#home-simulator-wrapper', model : app.simulatorModel});

  app.appView = new app.views.AppView({el : '#page-wrapper'});

});