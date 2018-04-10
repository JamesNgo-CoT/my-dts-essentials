/* global _ Backbone */

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

  parse: function(response, options) {
    if (response.__CreatedOn) {
      delete response.__CreatedOn;
    }
    if (response.__ModifiedOn) {
      delete response.__ModifiedOn;
    }
    if (response.__Owner) {
      delete response.__Owner;
    }
    if (response.__Status) {
      delete response.__Status;
    }
    return Backbone.Model.prototype.parse.call(this, response);
  }
});
