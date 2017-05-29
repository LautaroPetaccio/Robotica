"use strict";

this.app = app || {};

this.app.views = app.views || {};

this.app.views.NavBar = Backbone.View.extend({

	// Delegated events for creating new items, and clearing completed ones.
  events: {
    'click .btn_run' : 'onClickRun',
    'click .btn_pause' : 'onClickPause',
    'click .btn_stop': 'onClickStop',
    'click .btn_save' : 'onClickSave',
    'click .btn_export' : 'onClickExport',
    'click .btn_load' : 'onClickLoad',
    'click .btn_maps': 'onClickMaps',
    'click .btn_config' : 'onClickConfig'
  },

	// At initialization we bind to the relevant events on the `Todos`
	// collection, when items are added or changed. Kick things off by
	// loading any preexisting todos that might be saved in *localStorage*.
  initialize: function () {
    this.$btn_run = this.$el.find('.btn_run');
    this.$btn_pause = this.$el.find('.btn_pause');
    this.$btn_stop = this.$el.find('.btn_stop');
    this.$btn_save = this.$el.find('.btn_save');
    this.$btn_export = this.$el.find('.btn_export');
    this.$btn_load = this.$el.find('.btn_load');
    this.$btn_maps = this.$el.find('.btn_maps');
    this.$home_navbar_collapse = $('#home-navbar-collapse');
    this.$home_navbar_collapse_button = $('#home-navbar-collapse-button');

    key('ctrl+g, ⌘+g', keyHandler(this.onClickSave));
    key('ctrl+a, ⌘+a', keyHandler(this.onClickLoad));
    key('ctrl+e, ⌘+e', keyHandler(this.onClickRun));
    key('ctrl+p, ⌘+p', keyHandler(this.onClickPause));
    key('ctrl+d, ⌘+d', keyHandler(this.onClickStop));
    key('ctrl+m, ⌘+m', keyHandler(this.onClickMaps));
    
    function keyHandler(handler) {
      return function(event) {
        handler(event);
        event.preventDefault();
        event.stopPropagation();
      }
    }
  },

  onClickConfig : function(event) {
    app.configView.show();
  },

  onClickRun : function(event) {
    var onCompleted = function() {
      this.$btn_run.show();
      this.$btn_pause.hide();
      this.$btn_stop.addClass('disabled');
    }
    var onRun = function() {
      this.$btn_pause.show();
      this.$btn_stop.removeClass('disabled');
      this.$btn_run.hide();
    }
    app.simulatorModel.run($.proxy(onRun, this), $.proxy(onCompleted, this));
    event.stopPropagation();
  },

  onClickPause : function(event) {
    var onPause = function() {
      this.$btn_run.show();
      this.$btn_pause.hide();
    }
    app.simulatorModel.pause($.proxy(onPause, this));
  },

  onClickStop : function(event) {
    var onStop = function() {
      this.$btn_run.show();
      this.$btn_pause.hide();
      this.$btn_stop.addClass('disabled');
    }
    app.simulatorModel.stop($.proxy(onStop, this));
  },

  onClickSave : function(event) {
    // app.downloadArduinoCodeModal.saveProgram();
    app.downloadArduinoCodeView.show();
  },

  onClickExport : function(event) {
    // app.downloadArduinoCodeModal.exportProgram();
    app.downloadArduinoCodeView.show();
  },

  onClickLoad : function(event) {
    // app.LoadProgramView.loadProgram();
    app.blocklyView.loadProgram();
  },

  onClickMaps : function(event) {
    // app.MapsModalView.show();
    app.mapsSelectorView.show();
  },

  toggleNavbar : function() {
    if(this.$home_navbar_collapse.hasClass('in')) {
      this.$home_navbar_collapse_button.click();
    }
  },

  render: function () {
  }

});