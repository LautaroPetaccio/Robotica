"use strict";

this.Config = (function() {
  
  var module = {};

  module.render = function(selector) {
    return Views.loadView("config-modal", selector)
    .then(module.initialize);
  }

  module.initialize = function() {
  	$("#btn_config").click(module.openConfigModal);
    $("#sensor_hud_checkbox").change(module.changeHUDCheckbox);
  }

  module.openConfigModal = function(event) {
  	$("#config-modal").modal("show");
  }

  module.changeHUDCheckbox = function() {
    // Hide config modal.
    $("#config-modal").modal("hide");
    HomeNavbar.toggleNavbar();
    // Enable / disable HUD.
    if($(this).is(':checked')) {
      HomeSimulator.enableSensorsHUD();
    } else {
      HomeSimulator.disableSensorsHUD();
    }
  }

  return module;

})();
