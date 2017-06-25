"use strict";

this.app = app || {};

this.app.views = app.views || {};

this.app.views.Blockly = Backbone.View.extend({

  events: {
    'change #hidden-file-input' : 'onHiddenFileInputChange',
  },

  render : function() {
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
    
    this.workspace = Blockly.inject('blockly-div', blocklyOptions);
    this.model.set('workspace', this.workspace);

    // window.addEventListener('resize', this.onContainerResize, false);
    this.onContainerResize();

    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;

    /* Set math blocks color */
    Blockly.Blocks.math.HUE = 35;

  },

  initialize : function() {
    this.$hiddenFileInputElement = $('#hidden-file-input');
    this.$blocklyDivElement = this.$el.find("#blockly-div");
    this.workspace = null; 
    this.$blocklyDivWrapperElement = this.$blocklyDivElement.parent();
    $(window).on('resize.resizeview', this.onContainerResize.bind(this));
    this.render();
  },
  
  onContainerResize : function() {
    var wrapperWidth = this.$blocklyDivWrapperElement.width();
    var wrapperHeight = this.$blocklyDivWrapperElement.height();
    this.$blocklyDivElement.width(wrapperWidth);
    this.$blocklyDivElement.height(wrapperHeight);
    this.forceBlocklySvgResize();
  },

  forceBlocklySvgResize : function() {
    Blockly.svgResize(this.workspace);
  },

  /* Refactor this two functions */
  loadProgram : function() {
    this.$hiddenFileInputElement.click();
  },

  onTextLoad : function(event) {
    this.model.importWorkspaceXml(event.target.result);
  },

  onHiddenFileInputChange : function(event) {
    if (event.target.files.length > 0) {
      var fileToLoad = event.target.files[0];
      var reader = new FileReader();
      reader.onload = $.proxy(this.onTextLoad, this);
      reader.readAsText(fileToLoad);
    }
  },

});