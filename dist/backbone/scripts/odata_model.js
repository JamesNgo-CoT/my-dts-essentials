'use strict';

/* global _ Backbone */

/* exported ODataModel */
/** Backbone Model subclass to represent oData entity. */
var ODataModel = Backbone.Model.extend({

  // PROPERTY DEFINITION

  /** @type {string|function} */
  url: function url() {
    var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || function () {
      throw new Error('A "url" property or function must be specified');
    }();

    if (this.isNew()) {
      return base;
    }

    return base.replace(/\/$/, '') + '(\'' + encodeURIComponent(this.get(this.idAttribute)) + '\')';
  }
});