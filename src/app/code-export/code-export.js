"use strict";

this.CodeExport = (function() {
    
    var module = {};

    /* Source: http://stackoverflow.com/questions/18755750/saving-text-in-a-local-file-in-internet-explorer-10. */
    module.saveTextAsFile = function(text, filename) {
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
    }

    return module;

})();
