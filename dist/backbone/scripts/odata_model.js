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

  parse: function parse(response, options) {
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
  },

  toJSON: function toJSON() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    console.log('**********');
    console.log('OPTIONS', options);
    console.log('TO JSON');
    var json = Backbone.Model.prototype.toJSON.call(this, options);

    if (!options.returnAll) {
      delete json.note;
    }

    console.log(json);

    return json;
  }
});