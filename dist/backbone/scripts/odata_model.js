'use strict';

/* exported ODataModel */
var ODataModel = Backbone.Model.extend({

  // PROPERTY DEFINITION

  url: function url() {
    var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || function () {
      throw new Error('A "url" property or function must be specified');
    }();

    if (this.isNew()) {
      return base;
    }

    return base.replace(/\/$/, '') + '(\'' + encodeURIComponent(this.get(this.idAttribute)) + '\')';
  },

  // MODEL DEFINITION

  toJSON: function toJSON() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var json = Backbone.Model.prototype.toJSON.call(this, options);

    if (!options.includeMetaData) {
      delete json['@odata.context'];
      delete json['@odata.etag'];
      delete json['__CreatedOn'];
      delete json['__ModifiedOn'];
      delete json['__Owner'];
    }

    return json;
  }
});