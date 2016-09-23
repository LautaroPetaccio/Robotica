"use strict";

this.FileDownloadModal = function(wrapper, options) {
	var downloadFileModalElement;
	var downloadFileButtonElement;
  var downloadFileCancelButtonElement;
	var	downloadFileNameInputElement;
  var context = this;

	this.render = function() {
    return Views.loadView("file-download-modal", wrapper).then(function (value) {
      var wrapperElement = $(wrapper);
      downloadFileModalElement = wrapperElement.find(".file-download-modal");
      downloadFileNameInputElement = wrapperElement.find(".file-download-name-input");
      downloadFileButtonElement = wrapperElement.find(".file-download-button");
      downloadFileCancelButtonElement = wrapperElement.find(".file-cancel-button");;

      if(options.modalTitle) {
        downloadFileModalElement.find(".modal-title").html(options.modalTitle);
      }

      if(options.onSaveButtonClick) {
        downloadFileButtonElement.click(context.onSaveButtonClick);
      }

      if(options.onCancelButtonClick) {
        downloadFileCancelButtonElement.click(context.onCancelButtonClick);
      }

      /* When showed, focus modal */
      downloadFileModalElement.on('shown.bs.modal', function () {
        downloadFileNameInputElement.focus();
      });
      
      /* Enter to quick-save */
      downloadFileNameInputElement.keypress(function(event) {
        if (event.which == 13) {
          event.preventDefault();
          context.onSaveButtonClick();
        }
      });

    });
  }

  this.onSaveButtonClick = function() {
    options.onSaveButtonClick(downloadFileNameInputElement.val());
    context.hide();
  }

  this.onCancelButtonClick = function() {
    options.onCancelButtonClick(downloadFileNameInputElement.val());
    context.hide();
  }

  this.show = function() {
    downloadFileModalElement.modal('show');
  }

  this.hide = function() {
    downloadFileModalElement.modal('hide'); 
  }
}