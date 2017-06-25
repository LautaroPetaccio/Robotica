"use strict";

this.app = app || {};

this.app.views = app.views || {};

app.views.Simulator = Backbone.View.extend({
  initialize : function () {
    /* Load melonjs game. */
    me.interpreter = null;
    game.onload("simulator-screen");

    // Mobile browser hacks
    if (me.device.isMobile && !navigator.isCocoonJS) {
        // Prevent the webview from moving on a swipe
        window.document.addEventListener("touchmove", function (e) {
            e.preventDefault();
            window.scroll(0, 0);
            return false;
        }, false);
        // Scroll away mobile GUI
        (function () {
            window.scrollTo(0, 1);
            me.video.onresize(null);
        }).defer();
        me.event.subscribe(me.event.WINDOW_ONRESIZE, function (e) {
            window.scrollTo(0, 1);
        });
    }
    $(window).on('resize.resizeview', this.render.bind(this));
    $(window).on('orientationchange', this.render.bind(this));
    this.$screenElement = this.$el.find("#simulator-screen");
    this.$canvasElement = this.$el.find("#simulator-screen > canvas");
    this.render();
  },
  /* Needs refactoring */
  onContainerResize : function() {
    var screenWrapperElement = this.$screenElement.parent();
    var screenWrapperWidth = screenWrapperElement.width();
    var screenWrapperHeight = screenWrapperElement.height();
    var screenWidth = Math.min(screenWrapperWidth, screenWrapperHeight);
    var screenHeight = screenWidth;
    this.$screenElement.width(screenWidth);
    this.$screenElement.height(screenHeight);
    this.$canvasElement.width(screenWidth);
    this.$canvasElement.height(screenHeight);
  },

  enableSimulatorDragging : function() {
    this.$el.draggable({ containment: "window" });
    this.$el.draggable('enable');
  },
  
  disableSimulatorDragging : function() {
    this.$el.draggable({ containment: "window" });
    this.$el.draggable('disable');
    this.$el.attr('style', '');
  },

  resetDraggablePosition : function() {
    if (this.$el.hasClass('content-collapsed')) {
      this.disableSimulatorDragging();
      this.enableSimulatorDragging();
    }
  },

  render : function() {
    this.onContainerResize();
    this.resetDraggablePosition();
  }
});