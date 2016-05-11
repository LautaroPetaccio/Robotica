  "use strict";

this.BlocklyM = (function() {
    
    var module = {};

    module.workspace = {};

    module.initialize = function() {
      
      module.workspace = Blockly.inject('blockly-div', {
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
        }
      );
      
      window.addEventListener('resize', onResize, false);
      onResize();

      function onResize() {
        // Position blocklyDiv over blocklyContainer.
        var blocklyContainer = document.getElementById('blockly-container');
        var blocklyDiv = document.getElementById('blockly-div');
        blocklyDiv.style.left = blocklyContainer.offsetLeft + 'px';
        blocklyDiv.style.top = blocklyContainer.offsetTop + 'px';
        blocklyDiv.style.width = blocklyContainer.offsetWidth + 'px';
        blocklyDiv.style.height = blocklyContainer.offsetHeight + 'px';
      };

      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;

      // // Resize blockly workspace on window resize
      // window.addEventListener('resize', resizeBlocklyWorkspace, true);

      // /** Resizes the container for the Blockly workspace. */
      // var wrapper = $('#blocks-panel');
      // var content_blocks = $('#content-blocks svg');
      // var drawing_area = $('.drawing-area');
      // var drawing_screen = $('.drawing-area #screen');
      // var drawing_canvas = $('.drawing-area #canvas');
      
      // drawing_screen.hide();
      
      // function resizeBlocklyWorkspace() {
      //   content_blocks.css({ 'height': wrapper.height() + 'px' });
      //   var value = Math.floor((drawing_area.height() - drawing_screen.height())/2);
      //   drawing_screen.css({ 'padding-top': value + 'px' });
      //   closeDrawingArea();
      // };
      
      // setTimeout( function() {
      //   drawing_screen.fadeIn();
      //   resizeBlocklyWorkspace();
      // }, 100);


      // var closed = true;
      
      // function toggleDrawingArea() {
      //   if (closed) {
      //     openDrawingArea();
      //   } else {
      //     closeDrawingArea();
      //   }
      // }
      
      // function openDrawingArea() {
      //   if (closed) {
      //     drawing_area.stop().animate({
      //                   width: '650px',
      //                   height: '583px',
      //                   padding: '10px'
      //           }, 500, function() {});
      //     closed = false;
      //   }
      // }
      
      // function closeDrawingArea() {
      //   if (!closed) {
      //     drawing_area.stop().animate({
      //               width: '200px',
      //               height: '180px',
      //               padding: '0px'
      //       }, 500, function() {
      //         drawing_area.removeAttr('style');
      //       });
      //     closed = true;
      //   }
      // }

      // $('html').click(function() {
      //   closeDrawingArea();
      // });
      
      // $('#home-container .drawing-area').click(function(event) {
      //   if ($(window).width() < 992) {
      //     toggleDrawingArea();
      //   }
      //   event.stopPropagation();
      // });
    }
    
    return module;
})();





