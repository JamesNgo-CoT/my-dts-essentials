'use strict';

/* global ODataModel */

/* exported ODataCollection */
var ODataCollection = Backbone.Collection.extend({

  // PROPERTY DEFINITION

  $count: true,

  $filter: null,

  $select: null,

  count: null,

  data: null,

  model: function model(attrs, options) {
    return new ODataModel(attrs, options);
  },

  // METHOD DEFINITION

  fetch: function fetch() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.count = null;

    this.data = options.data || {};

    if (options.data['$count'] == null) {
      options.data['$count'] = _.result(this, '$count');
    }

    var $filter = _.result(this, '$filter');
    if ($filter) {
      options.data['$filter'] = $filter + (options.data['$filter'] ? ' and ' + options.data['$filter'] : '');
    }

    var $select = _.result(this, '$select');
    if ($select) {
      options.data['$select'] = $select.split(',').concat(options.data['$select'] ? options.data['$select'].split(',') : []).map(function (value) {
        return $.trim(value);
      }).filter(function (value, index, array) {
        return array.indexOf(value) === index;
      }).join(',');
    }

    var data = [];
    for (var k in options.data) {
      data.push(k + '=' + options.data[k]);
    }
    options.data = data.join('&');

    options.processData = false;

    return Backbone.Collection.prototype.fetch.call(this, options);
  },

  parse: function parse(response, options) {
    if (response['@odata.count']) {
      this.count = response['@odata.count'];
    }

    return Backbone.Collection.prototype.parse.call(this, response.value);
  }
});