/* global ODataModel */

/* exported ODataCollection */
const ODataCollection = Backbone.Collection.extend({

  // PROPERTY DEFINITION

  $count: true,

  $filter: null,

  $select: null,

  count: null,

  data: null,

  model: (attrs, options) => new ODataModel(attrs, options),

  // METHOD DEFINITION

  fetch: function(options = {}) {
    this.count = null;

    this.data = options.data || {};

    if (options.data['$count'] == null) {
      options.data['$count'] = _.result(this, '$count');
    }

    const $filter = _.result(this, '$filter');
    if ($filter) {
      options.data['$filter'] = $filter + (options.data['$filter'] ? ' and ' + options.data['$filter'] : '');
    }

    const $select = _.result(this, '$select');
    if ($select) {
      options.data['$select'] = $select.split(',')
        .concat(options.data['$select'] ? options.data['$select'].split(',') : [])
        .map((value) => $.trim(value))
        .filter((value, index, array) => array.indexOf(value) === index)
        .join(',');
    }

    let data = [];
    for (const k in options.data) {
      data.push(k +'=' + options.data[k]);
    }
    options.data = data.join('&');

    options.processData = false;
    
    return Backbone.Collection.prototype.fetch.call(this, options);
  },

  parse: function(response, options) {
    if (response['@odata.count']) {
      this.count = response['@odata.count'];
    }
    
    return Backbone.Collection.prototype.parse.call(this, response.value);
  }
});
