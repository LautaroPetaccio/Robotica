"use strict";

this.app = app || {};

this.app.models = app.models || {};

this.app.models.FileSave = Backbone.Model.extend({
  defaults: {
    fileExtension : '',
    defaultFileName : '',
    extractCode : function() {}
  },

  initialize: function() {
  },

  downloadWithFileName : function(fileName) {
    var text = this.get('extractCode')();
    this.saveTextAsFile(text, this.formatFileName(fileName, this.get('fileExtension')));
  },

  saveTextAsFile : function(text, filename) {
    /* Saves a text string as a blob file*/  
    var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/);
    var ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/);
    var ieEDGE = navigator.userAgent.match(/Edge/g);
    var ieVer=(ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

    if (ie && ieVer < 10) {
      console.log("No blobs on IE ver < 10.");
      return;
    }

    var textFileAsBlob = new Blob([text], {
      type: 'text/plain'
    });

    if (ieVer > -1) {
      window.navigator.msSaveBlob(textFileAsBlob, filename);
    } else {
      var downloadLink = document.createElement("a");
      downloadLink.download = filename;
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = function(e) { document.body.removeChild(e.target); };
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      downloadLink.click();
    }
  },

  formatFileName : function(fileName, extension) {
    fileName = fileName || this.get('defaultFileName') + extension;
    if (fileName.length < 4 || fileName.substr(fileName.length - 4) != extension) {
      fileName += extension;
    }
    return fileName;
  }

});