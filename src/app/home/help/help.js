"use strict";

this.Help = (function() {
  
  var module = {};

  module.render = function(selector) {
  		console.log("Se ejecuta")
  	    return Views.loadView("faq-modal", selector)
        .then(module.initialize);
  }

  module.initialize = function() {	
  	console.log("Initialized");
  	$("#btn_faq").click(module.openFAQModal);
  }

  module.openFAQModal = function(event) {
  	$("#faq-modal").modal("show");
  }

  return module;

})();