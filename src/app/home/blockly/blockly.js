"use strict";

this.HomeBlockly = (function() {
    
  var module = {};

  module.workspace = null;

  var downloadCodeModalElement = undefined;
  var downloadCodeNameInputElement = undefined;
  var downloadCodeButtonElement = undefined;
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
    var downloadCodeModalPromise = Views.loadView("download-code-modal", "#download-code-modal-wrapper");
    return Q.all([blocklyToolboxPromise, downloadCodeModalPromise]);
  }

  module.initialize = function() {
    
    downloadCodeModalElement = $("#download-code-modal");
    downloadCodeNameInputElement = $('#download-code-name-input');
    downloadCodeButtonElement = $("#download-code-button");
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

    downloadCodeModalElement.on('shown.bs.modal', function () {
      downloadCodeNameInputElement.focus();
    });

    downloadCodeButtonElement.click(HomeBlockly.onDownloadCodeButtonClick);

    downloadCodeNameInputElement.keypress(HomeBlockly.onKeyPressedInDowloadCodeNameInput);

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
    downloadCodeModalElement.modal('show');
  }

  module.onDownloadCodeButtonClick = function() {
    downloadCodeModalElement.modal('hide');
    var downloadFile = downloadCodeNameInputElement.val() || "robotica-dc.xml";
    if (downloadFile.length < 4 || downloadFile.substr(downloadFile.length - 4) != ".xml") {
      downloadFile += ".xml";
    }
    FileSave.saveTextAsFile(HomeBlockly.exportWorkspaceXml(), downloadFile);
  }

  module.onKeyPressedInDowloadCodeNameInput = function(event) {
    if (event.which == 13) {
        event.preventDefault();
        HomeBlockly.onDownloadCodeButtonClick();
    }
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

  module.importWorkspaceXml = function(xmlText) {
    HomeBlockly.workspace.clear();
    var xmlDom = Blockly.Xml.textToDom(xmlText);
    Blockly.Xml.domToWorkspace(xmlDom, HomeBlockly.workspace);
  }
  
  return module;
    
})();





