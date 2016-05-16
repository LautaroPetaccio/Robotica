"use strict";

this.Views = (function() {
    
    var module = {};

    module.loadView = function(view, selector) {
      var defer = Q.defer();
      $(selector).load(getViewPath(view), function() {
        defer.resolve();
      });
      return defer.promise;
    }

    function getViewPath(view) {
      return "html/" + view + ".html";
    }
    
    return module;

})();
