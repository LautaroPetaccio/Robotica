"use strict";

this.app = app || {};

this.app.views = app.views || {};

this.app.views.MapsSelectorView = Backbone.View.extend({
  initialize : function() {
    this.$modal = this.$el.find('.modal');
    this.$el.find('.media').click(this.onMapSelectionClick);
  },
  show : function() {
    this.$modal.modal('show');
  },
  hide : function() {
    this.$modal.modal('hide');
  },
  onMapSelectionClick : function () {
    var selectedMap = $(this).attr("id");
    // Hide map selection modal.
    app.mapsSelectorView.hide();
    app.navBarView.toggleNavbar();
    // If there is no code in workspace, change map. Otherwise, ask for confirmation first.
    if(app.blocklyModel.codeIsEmpty()) {
      app.simulatorModel.changeMap(selectedMap);
    }
    else {
      bootbox.dialog({
        message: "Un cambio de mapa eliminará el código existente. Querés continuar?",
        title: "Cambiar Mapa",
        buttons: {
          default: {
            label: "Cancelar",
            className: "btn-default"
          },
          success: {
            label: "Cambiar mapa",
            className: "btn-success",
            callback: function() {
              app.simulatorModel.changeMap(selectedMap);
            }
          }
        }
      });
    }
  }
  
});