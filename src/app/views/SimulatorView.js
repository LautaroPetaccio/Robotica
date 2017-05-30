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
    $(window).on('resize.resizeview', this.onContainerResize.bind(this));
    this.onContainerResize();
  },
  /* Needs refactoring */
  onContainerResize : function() {
    var screenElement = $("#simulator-screen");
    var canvasElement = $("#simulator-screen > canvas");
    var screenWrapperElement = screenElement.parent();
    var screenWrapperWidth = screenWrapperElement.width();
    var screenWrapperHeight = screenWrapperElement.height();
    var screenWidth = Math.min(screenWrapperWidth, screenWrapperHeight);
    var screenHeight = screenWidth;
    screenElement.width(screenWidth);
    screenElement.height(screenHeight);
    canvasElement.width(screenWidth);
    canvasElement.height(screenHeight);
  }
});