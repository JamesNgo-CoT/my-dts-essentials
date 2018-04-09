/* global _ Backbone */

/* exported ODataModel */
/** Backbone Model subclass to represent oData entity. */
const ODataModel = Backbone.Model.extend({

  // PROPERTY DEFINITION

  /** @type {string|function} */
  url: function () {
    const base = _.result(this, 'urlRoot') || _.result(this.collection, 'url')
      || (() => { throw new Error('A "url" property or function must be specified'); })();

    if (this.isNew()) {
      return base
    }

    return base.replace(/\/$/, '') + '(\'' + encodeURIComponent(this.get(this.idAttribute)) + '\')';
  }
});
