
/* exported ODataModel */
const ODataModel = Backbone.Model.extend({

  // PROPERTY DEFINITION

  url: function () {
    const base = _.result(this, 'urlRoot') || _.result(this.collection, 'url')
      || (() => { throw new Error('A "url" property or function must be specified'); })();

    if (this.isNew()) {
      return base
    }

    return base.replace(/\/$/, '') + '(\'' + encodeURIComponent(this.get(this.idAttribute)) + '\')';
  },

  // MODEL DEFINITION

  toJSON: function(options = {}) {
    const json = Backbone.Model.prototype.toJSON.call(this, options);

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
