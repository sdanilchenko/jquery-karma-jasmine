// global namespace
var app = window.app || {};

/**
 * Grid component (view/controller)
 */
app.Grid = (function () {
  function Grid(rootElem, gridData, utils) {
    this.el = $(rootElem);
    this.utils = utils;
    this.model = gridData;

    this.init();
  }

  Grid.prototype.init = function () {
    var grid = this;
    this.model.fetch(this._getId())
      .then(function (response) {
        return grid.setData({ data: response });
      })
      .fail(function () {
        return grid.setData({ data: null });
      });
  };

  Grid.prototype.setData = function (data) {
    var self = this;
    return this.utils.tmpl.loadTemplate('app/templates/grid.html')
      .then(function (tplElem) {
        var html = self.utils.tmpl.invokeTemplate(tplElem, data);
        self.el.find('#grid-container').html(html);
        return html;
      });
  };


  Grid.prototype._getId = function () {
    return this.utils.getUrlParam('id');
  };

  return Grid;
})();


/**
 * Grid data model
 */
app.GridData = (function () {

  function GridData() {}

  GridData.prototype.fetch = function (docId) {
    if(!docId) {
      var dfd = $.Deferred();
      dfd.reject(null);
      return dfd.promise();
    }
    return $.getJSON(this._getUrl(docId))
      .then(function (response) {
        return response[0];
      });
  };

  GridData.prototype._getUrl = function (docId) {
    return '//iac.tender.pro/demo/company_' + docId + '.json';
  };

  return GridData;
})();

/**
 * Namespace for utility functions
 */
app.utils = {

  /**
   * Get parameter from 'location.search' by its name
   */
  getUrlParam: function (name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(window.location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  },

  /**
   * Simple JavaScript Templating
   * Original: John Resig's - http://ejohn.org/blog/javascript-micro-templating/ - MIT Licensed
   * This implementation uses tags:
   * <? ?> for instructions,
   * <?= ?> for printing values.
   */
  tmpl: {
  	/**
  	 * Private function which compiles passed template string into templating function,
  	 * shouldn't be called directly
  	 */
  	compile: function(str) {
  		return new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str.replace(/[\r\t\n]/g, " ")
  				.split("<?").join("\t")
  				.replace(/((^|\?>)[^\t]*)'/g, "$1\r")
  				.replace(/\t=(.*?)\?>/g, "',$1,'")
  				.split("\t").join("');")
  				.split("?>").join("p.push('")
  				.split("\r").join("\\'")
          + "');}return p.join('');"
  	    );
  	},

  	/**
  	 * Invoke template element
     * @param {jQuery|String} element which should be invoked
     * @param {Object} data for template
     * @returns {String} Returns generated html
  	 */
  	invokeTemplate: (function(){
  		var cache = {};

      return function (ident, data) {
          var elem,
              elemId;

          if (typeof ident === 'string') {
              elem = jQuery('#' + ident);
              elemId = ident;
          } else if (ident instanceof jQuery) {
              elem = ident;
              elemId = ident.id;
          }

          if (elem.attr('type') === 'text/x-template') {
          	//get from cache or compile templating function
              var tpl = cache[elemId] ||
              	(cache[elemId] = this.compile(elem.html()));

              //execute template with passed data
              var html = tpl(data || {});
              return html;
          }
      }
  	})(),

    /**
     * Loads template by given url
     * @param {String} url to loaded template
     * @returns {jxXHR|Promise}
     */
    loadTemplate: function (url) {
      return $.ajax(url, { dataType: 'text' })
        .pipe(function (template) {
          return $(template);
        });
    }
  }
};
