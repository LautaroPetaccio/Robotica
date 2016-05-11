"use strict";

this.SimulatorM = (function() {

  var module = {};

  module.initialize = function() {
    me.interpreter = null;
    game.onload("melonjs-screen");

    window.addEventListener('resize', onResize, false);
    
    onResize();

    function onResize() {
      var canvasWrapperElement = $("#melonjs-screen");
      var canvasElement = $("#melonjs-screen > canvas");
      var canvasWidth = Math.min(canvasWrapperElement.width(), canvasWrapperElement.height());
      var canvasHeight = canvasWidth;
      canvasElement.width(canvasWidth);
      canvasElement.height(canvasHeight);
    };

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
  }
    
  return module;
})();
