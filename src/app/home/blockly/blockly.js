"use strict";

this.HomeBlockly = (function() {
    
  var module = {};

  module.render = function(selector) {
    return Views.loadView("blockly", selector).then(function() {
      return Views.loadView("blockly-toolbox", "#blockly-toolbox-wrapper").then(function() {
        module.initialize();
      });
    });
  }

  module.workspace = null;

  module.initialize = function() {
    
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
  }
  
  module.onContainerResize = function() {
    // Position blocklyDiv over blocklyContainer.
    var blocklyDivElement = $("#blockly-div");
    var blocklyDivWrapperElement = blocklyDivElement.parent();
    var wrapperWidth = blocklyDivWrapperElement.width();
    var wrapperHeight = blocklyDivWrapperElement.height();
    blocklyDivElement.width(wrapperWidth);
    blocklyDivElement.height(wrapperHeight);
    module.forceBlocklySvgResize();
  }

  module.forceBlocklySvgResize = function() {
    Blockly.svgResize(HomeBlockly.workspace);
  }
  
  return module;
    
})();





