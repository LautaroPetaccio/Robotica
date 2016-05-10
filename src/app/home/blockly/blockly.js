"use strict";

this.BlocklyM = (function() {
    
    var module = {};

    module.initialize = function() {
      var blocklyArea = document.getElementById('blockly-area');
      var blocklyContainer = document.getElementById('blockly-container');
      
      module.workspace = Blockly.inject(blocklyContainer, {
        toolbox: document.getElementById('blockly-toolbox'),
        media: 'assets/blockly/',
        zoom: { controls: true }
      });
      
      window.addEventListener('resize', onResize, false);
      onResize();

      function onResize() {
        // Position blocklyContainer over blocklyArea.
        blocklyContainer.style.left = blocklyArea.offsetLeft + 'px';
        blocklyContainer.style.top = blocklyArea.offsetTop + 'px';
        blocklyContainer.style.width = blocklyArea.offsetWidth + 'px';
        blocklyContainer.style.height = blocklyArea.offsetHeight + 'px';
      };
    }

    module.workspace = {};
    
    return module;
})();
