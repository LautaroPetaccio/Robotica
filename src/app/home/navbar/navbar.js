"use strict";

this.HomeNavbar = (function() {
  
  var module = {};

  module.render = function(selector) {
    return Views.loadView("navbar", selector)
        .then(module.initialize);
  }

  module.initialize = function() {
    // Click events binding.
    $('.btn_run').click(module.onClickRun);
    $('.btn_pause').click(module.onClickPause);
    $('.btn_stop').click(module.onClickStop);
    $('.btn_save').click(module.onClickSave);
    $('.btn_load').click(module.onClickLoad);
    $('.btn_maps').click(module.onClickMaps);
    
    // Shortcuts.
    key('ctrl+g, ⌘+g', keyHandler(module.onClickSave));
    key('ctrl+a, ⌘+a', keyHandler(module.onClickLoad));
    key('ctrl+e, ⌘+e', keyHandler(module.onClickRun));
    key('ctrl+p, ⌘+p', keyHandler(module.onClickPause));
    key('ctrl+d, ⌘+d', keyHandler(module.onClickStop));
    key('ctrl+m, ⌘+m', keyHandler(module.onClickMaps));

    function keyHandler(handler) {
      return function(event) {
        handler(event);
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  module.onClickRun = function(event) {
    var onCompleted = function() {
      $('.btn_run').show();
      $('.btn_pause').hide();
      $('.btn_stop').addClass('disabled');
    }
    var onRun = function() {
      $('.btn_pause').show();
      $('.btn_stop').removeClass('disabled');
      $('.btn_run').hide();
    }
    HomeSimulator.run(onRun, onCompleted);
    event.stopPropagation();
  }

  module.onClickPause = function(event) {
    HomeSimulator.pause(function() {
      $('.btn_run').show();
      $('.btn_pause').hide();
    });
  }

  module.onClickStop = function(event) {
    HomeSimulator.stop(function() {
      $('.btn_run').show();
      $('.btn_pause').hide();
      $('.btn_stop').addClass('disabled');
    });
  }

  module.onClickSave = function(event) {
    HomeBlockly.saveProgram();
  }

  module.onClickLoad = function(event) {
    HomeBlockly.loadProgram();
  }

  module.onClickMaps = function(event) {
    Home.showMapsModal();
  }

  module.toggleNavbar = function() {
    if ($('#home-navbar-collapse').hasClass('in')) {
      $('#home-navbar-collapse-button').click();
    }
  }

  return module;

})();
