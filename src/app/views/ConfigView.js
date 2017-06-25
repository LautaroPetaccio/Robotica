  "use strict";

this.app = app || {};

this.app.views = app.views || {};

this.app.views.ConfigView = Backbone.View.extend({
  initialize : function() {
    this.$el.find("#sensor_hud_checkbox").change(this.changeHUDCheckbox);
    this.$modal = this.$el.find('.modal');
  },

  show : function() {
  	this.$modal.modal('show');
  },

  hide : function() {
    this.$modal.modal('hide');
  },

  changeHUDCheckbox : function() {
    // Hide config modal.
    app.configView.hide();
    app.navBarView.toggleNavbar();
    // Enable / disable HUD.
    if($(this).is(':checked')) {
      app.simulatorModel.enableSensorsHUD();
    } else {
      app.simulatorModel.disableSensorsHUD();
    }
  }
});