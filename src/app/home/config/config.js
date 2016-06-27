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
    if($(this).is(':checked'))
      this.HomeSimulator.activateSensorsHUD();
    console.log("Cambio valor");
    console.log("Value: " + $(this).is(':checked'));
  }

  return module;

})();