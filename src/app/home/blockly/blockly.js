"use strict";

this.HomeBlockly = (function() {
    
  var module = {};

  module.workspace = null;

  var downloadCodeModal = undefined;
  var exportCodeModal = undefined;
  var hiddenFileInputElement = undefined;
  var blocklyDivElement = undefined;
  var blocklyDivWrapperElement = undefined;

  module.render = function(selector) {
    return Views.loadView("blockly", selector)
        .then(module.renderSubviews)
        .then(module.initialize);
  }

  module.renderSubviews = function() {
    var blocklyToolboxPromise = Views.loadView("blockly-toolbox", "#blockly-toolbox-wrapper");
    downloadCodeModal = new FileDownloadModal("#download-code-modal-wrapper", 
      {"onSaveButtonClick" : HomeBlockly.onDownloadCodeButtonClick,
       "modalTitle" : "Guardar código"});
    exportCodeModal = new FileDownloadModal("#export-code-modal-wrapper", 
      {"onSaveButtonClick" : HomeBlockly.onExportCodeButtonClick,
       "modalTitle" : "Exportar código para Arduino"});
    var exportCodePromise = exportCodeModal.render();
    var fileDownloadPromise = downloadCodeModal.render();
    return Q.all([blocklyToolboxPromise, fileDownloadPromise, exportCodePromise]);
  }

  module.initialize = function() {

    hiddenFileInputElement = $('#hidden-file-input');
    blocklyDivElement = $("#blockly-div");
    blocklyDivWrapperElement = blocklyDivElement.parent();

    var blocklyOptions = {
      media: 'assets/blockly/',
      sounds: true,
      toolbox: document.getElementById('blockly-toolbox'),
      rtl: false,
      collapse: true,
      comments: true,
      css: true,
      disable: true,
      grid: false,
      maxBlocks: Infinity,
      zoom: {
        controls: true,
        wheel: false,
        startScale: 0.8,
        maxScale: 2,
        minScale: 0.2,
        scaleSpeed: 1.2
      }
    };
    
    module.workspace = Blockly.inject('blockly-div', blocklyOptions);

    window.addEventListener('resize', module.onContainerResize, false);
    module.onContainerResize();

    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;

    /* Set math blocks color */
    Blockly.Blocks.math.HUE = 35;

    hiddenFileInputElement.change(HomeBlockly.onHiddenFileInputChange);
  }
  
  module.onContainerResize = function() {
    var wrapperWidth = blocklyDivWrapperElement.width();
    var wrapperHeight = blocklyDivWrapperElement.height();
    blocklyDivElement.width(wrapperWidth);
    blocklyDivElement.height(wrapperHeight);
    module.forceBlocklySvgResize();
  }

  module.forceBlocklySvgResize = function() {
    Blockly.svgResize(HomeBlockly.workspace);
  }

  module.saveProgram = function() {
    downloadCodeModal.show();
  }

  module.exportProgram = function() {
    exportCodeModal.show();
  }

  /* TODO repeated code */
  module.onDownloadCodeButtonClick = function(fileName) {
    fileName = FileSave.formatFileName(fileName, ".xml");
    FileSave.saveTextAsFile(HomeBlockly.exportWorkspaceXml(), fileName);
  }

  module.onExportCodeButtonClick = function(fileName) {
    fileName = FileSave.formatFileName(fileName, ".c");
    FileSave.saveTextAsFile(HomeBlockly.exportWorkspaceArduino(), fileName);
  }

  module.loadProgram = function() {
    hiddenFileInputElement.click();
  }

  module.onHiddenFileInputChange = function(event) {
    if (event.target.files.length > 0) {
      var fileToLoad = event.target.files[0];
      var reader = new FileReader();
      reader.onload = function() {
        HomeBlockly.importWorkspaceXml(reader.result);
      }
      reader.readAsText(fileToLoad);
    }
  }

  module.exportWorkspaceXml = function() {
    var xmlDom = Blockly.Xml.workspaceToDom(module.workspace);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    return xmlText;
  }

  module.addArduinoFooter = function(code) {
    code = code.slice(0, -1);
    code += "  while(true) {\n    delay(1000);\n  }\n}";
    return code;
  }

  /* TODO Add header */
  module.addArduinoHeader = function (code) {
    return code;
  }

  module.exportWorkspaceArduino = function() {
    var code = Blockly.Arduino.workspaceToCode(module.workspace);
    code = module.addArduinoFooter(code);
    return code;
  }

  module.importWorkspaceXml = function(xmlText) {
    HomeBlockly.workspace.clear();
    var xmlDom = Blockly.Xml.textToDom(xmlText);
    Blockly.Xml.domToWorkspace(xmlDom, HomeBlockly.workspace);
  }
  
  return module;
    
})();





