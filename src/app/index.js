"use strict";

this.IndexM = (function() {
    
    var module = {};

    module.loadPage = function(page, callback) {
      callback = _.isFunction(callback) ? callback : function() {}
      $("body > div#page-wrapper").load("html/" + page + ".html", callback);
    }

    module.loadPartial = function(selector, partial, callback) {
      selector = _.isString(selector) ? selector : "body > div#page-wrapper";
      callback = _.isFunction(callback) ? callback : function() {}
      $(selector).load("html/" + partial + ".html", callback);
    }

    return module;

})();
