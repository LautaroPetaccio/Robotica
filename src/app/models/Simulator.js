"use strict";

this.app = app || {};

this.app.models = app.models || {};

this.app.models.Simulator = Backbone.Model.extend({
  initialize : function() {
    this.onWorkspaceChangeCallback = $.proxy(this.onWorkspaceChange, this);
  },
  enableSensorsHUD : function() {
    me.game.HUD.enableHUD();
  },

  disableSensorsHUD : function() {
    me.game.HUD.disableHUD();
  },

  onWorkspaceChange : function(event) {
    if(event.type == Blockly.Events.CHANGE || 
      event.type == Blockly.Events.CREATE || 
      event.type == Blockly.Events.DELETE) {
      /* If the code was modified, finish the execution */
      me.execution.finish();
      /* Remove the event listener */
      app.blocklyModel.removeWorkspaceOnChangeListener(this.onWorkspaceChangeCallback);
    }
  },

  pause : function(onPause) {
    if(me.execution.isRunning()) {
      onPause();
      me.execution.pause();
      /* While being paused, check if the code was modified */
      app.blocklyModel.addWorkspaceOnChangeListener(this.onWorkspaceChangeCallback);
    }
  },

  stop : function(onStop) {
    if(!me.execution.hasFinished()) {
      onStop();
      me.execution.finish();
      me.state.change(me.state.PLAY);
    }
  },

  run : function(onRun, onCompleted) {
    if(me.execution.hasFinished()) {
      var code = app.blocklyModel.exportWorkspaceJavascript();
      if(!code.length) {
        module.notifyEmptyProgram();
        return;
      }
      me.state.pause();
      me.state.change(me.state.PLAY);
      me.execution.onCompleted = onCompleted;
      me.interpreter = this.get('interpreter').createInterpreter(code);
      me.state.resume();
    }
    if(me.execution.isPaused()) {
      /* Remove the event listener */
      app.blocklyModel.removeWorkspaceOnChangeListener(this.onWorkspaceChangeCallback);
    }
    if(!me.execution.isRunning()) {
      onRun();
      me.execution.run();
    }
  },

  changeMap : function(mapName) {
    app.blocklyModel.clearWorkspace();
    me.game.changeMap(mapName);
  },

  notifyEmptyProgram : _.throttle(function() {
    toastr.info('No hay código para ejecutar.', 'Programa vacío', {timeOut: 2000});
  }, 3000, {trailing: false}),

  notifySaturationLeftWheel : _.throttle(function() {
    this.notifySaturation('La potencia de la rueda izquierda está fuera del rango [-100, 100].');
  }, 3000, {trailing: false}),

  notifySaturationRightWheel : _.throttle(function() {
    this.notifySaturation('La potencia de la rueda derecha está fuera del rango [-100, 100].');
  }, 3000, {trailing: false}),

  notifySaturation : function(mensaje) {
    toastr.warning(mensaje, 'Potencia fuera de límite', {timeOut: 2000});
  }
});