"use strict";

this.app = app || {};

this.app.views = app.views || {};

this.app.views.FileSave = Backbone.View.extend({
  defaults: {},

  events: {
    'click .file-download-button' : 'onSaveButtonClick',
    'click .file-cancel-button' : 'onCancelButtonClick',
    'keypress .file-download-name-input': 'onInputKeyPress',
  },

  initialize : function() {
    this.$fileNameInput = this.$el.find(".file-download-name-input");
    this.$modal = this.$el.find(".modal");
  },

	render : function() {
    /* When showed, focus modal */
    this.$modal.on('shown.bs.modal', function () {
      this.$fileNameInput.focus();
    });
  },

  onSaveButtonClick : function() {
    // Modelo
    this.model.downloadWithFileName(this.$fileNameInput.val());
    this.hide();
  },

  onInputKeyPress : function (event) {
    if (event.which == 13) {
      event.preventDefault();
      this.onSaveButtonClick();
    }
  },

  onCancelButtonClick : function() {
    this.hide();
  },

  show : function() {
    this.$modal.modal('show');
  },

  hide : function() {
    this.$modal.modal('hide');
  },
});