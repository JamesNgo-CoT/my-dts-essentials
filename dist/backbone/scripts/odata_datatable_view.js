'use strict';

/* global _ Backbone moment */

/* exported ODataDataTableView */
var ODataDataTableView = Backbone.View.extend({

  // PROPERTY DEFINITION

  columns: null,

  template: _.template('\n    <table class="table table-bordered table-striped">\n      <thead>\n        <tr>\n        <% for (var i = 0, l = columns.length; i < l; i++) { %>\n          <th><%= columns[i].title || columns[i].data %></th>\n        <% } %>\n        </tr>\n      </thead>\n      <tfoot>\n        <tr>\n        <% for (var i = 0, l = columns.length; i < l; i++) { %>\n          <td data-index="<%= i %>">\n          <% if (_.result(columns[i], \'searchHtml\')) { %>\n            <%= _.result(columns[i], \'searchHtml\') %>\n          <% } %>\n          </td>\n        <% } %>\n        </tr>\n      </tfoot>\n    </table>\n  '),

  // EVENT HANDLER DEFINITION

  doColumnSearch: function doColumnSearch(e) {
    e.preventDefault();

    if (this.dataTable) {
      var $input = $(e.currentTarget);
      var value = $input.val();
      var index = +$input.closest('td').data('index');
      var dataTableColumn = this.dataTable.column(index);

      var searchString = '';

      if (this.columns[index].searchMap) {
        searchString = this.columns[index].searchMap(value, dataTableColumn, index) || '';
      }

      if (searchString !== dataTableColumn.search()) {
        dataTableColumn.search(searchString);
        dataTableColumn.draw();
      }
    }
  },

  events: {
    'change tfoot :input': 'doColumnSearch',
    'keyup tfoot :input': 'doColumnSearch'
  },

  // METHOD DEFINITION

  buttonCopy: function buttonCopy() {
    this.$el.find('.buttons-copy').click();
  },

  buttonCsv: function buttonCsv() {
    this.$el.find('.buttons-csv').click();
  },

  buttonExcel: function buttonExcel() {
    this.$el.find('.buttons-excel').click();
  },

  buttonPdf: function buttonPdf() {
    this.$el.find('.buttons-pdf').click();
  },

  buttonPrint: function buttonPrint() {
    this.$el.find('.buttons-print').click();
  },

  reload: function reload(callback, resetPaging) {
    if (this.dataTable) {
      this.dataTable.ajax.reload(callback, resetPaging);
    }
  },

  remove: function remove() {
    if (this.dataTable) {
      this.dataTable.destroy();
    }

    Backbone.View.prototype.remove.call(this);
  },

  render: function render() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (options.columns) {
      this.columns = _.result(options, 'columns');
    } else {
      options.columns = _.result(this, 'columns');
    }

    options.collection = this.collection.toJSON();

    if (this.dataTable) {
      this.dataTable.destroy();
    }

    this.$el.html(this.template(options));

    var config = $.extend({
      ajax: function ajax(data, callback, settings) {
        var fetchData = {};

        // $count
        fetchData.$count = true;

        // $filter
        var $filter = data.columns.filter(function (value, index, array) {
          return value.searchable && value.search && value.search.value;
        }).map(function (value, index, array) {
          return value.search.value;
        }).join(' and ');
        if ($filter) {
          fetchData.$filter = $filter;
        }

        // $orderby
        fetchData.$orderby = data.order.map(function (value) {
          return data.columns[value.column].data + ' ' + value.dir;
        }).join(',');

        // $search
        if (data.search && data.search.value) {
          fetchData.$search = '"' + data.search.value + '"';
        }

        // $select
        var $select = settings.aoColumns.map(function (value) {
          return value.data;
        }).map(function (value) {
          return $.trim(value);
        }).filter(function (value, index, array) {
          return array.indexOf(value) === index;
        }).join(',');
        if ($select) {
          fetchData.$select = $select;
        }

        // $skip
        fetchData.$skip = data.start;

        // $top
        fetchData.$top = data.length;

        _this.trigger('loadStart');
        _this.collection.fetch({ data: fetchData }).then(function () {
          _this.trigger('loadEnd');
          callback({
            data: _this.collection.toJSON(),
            draw: data.draw,
            recordsTotal: _this.collection.count || 0,
            recordsFiltered: _this.collection.count || 0
          });
        });
      },
      columns: _.result(this, 'columns'),
      dom: '<\'row\'<\'col-sm-6\'l><\'col-sm-6\'f>><\'row\'<\'col-sm-12\'<\'table-responsive\'tr>>><\'row\'<\'col-sm-5\'i><\'col-sm-7\'p>>B',
      serverSide: true
    }, options);

    this.dataTable = this.$el.find('table').DataTable(config);

    return Promise.resolve();
  }
}, {
  columnSearchMaps: {
    dateEquals: function dateEquals(value, dataTableColumn, index) {
      var searchString = '';

      if (value) {
        if (value === 'NULL') {
          searchString = dataTableColumn.dataSrc() + ' eq null';
        } else if (value === '!NULL') {
          searchString = dataTableColumn.dataSrc() + ' ne null';
        } else if (moment(value, 'l').isValid()) {
          searchString = dataTableColumn.dataSrc() + ' eq ' + moment(value, 'l').format();
        }
      }

      return searchString;
    },

    numberEquals: function numberEquals(value, dataTableColumn, index) {
      var searchString = '';

      if (value) {
        if (value === 'NULL') {
          searchString = dataTableColumn.dataSrc() + ' eq null';
        } else if (value === '!NULL') {
          searchString = dataTableColumn.dataSrc() + ' ne null';
        } else if (isNaN(value)) {
          searchString = dataTableColumn.dataSrc() + ' eq ' + value;
        }
      }

      return searchString;
    },

    numberExpression: function numberExpression(value, dataTableColumn, index) {
      var searchString = '';

      value = $.trim(value);
      if (value) {
        if (value.indexOf('!=') === 0) {
          value = $.trim(value.replace('!=', ''));
          if (value) {
            if (value === 'NULL') {
              searchString = dataTableColumn.dataSrc() + ' ne null';
            } else if (value === '!NULL') {
              searchString = dataTableColumn.dataSrc() + ' eq null';
            } else if (!isNaN(value)) {
              searchString = dataTableColumn.dataSrc() + ' ne ' + value;
            }
          }
        } else if (value.indexOf('>=') === 0) {
          value = $.trim(value.replace('>=', ''));
          if (value && !isNaN(value)) {
            searchString = dataTableColumn.dataSrc() + ' ge ' + value;
          }
        } else if (value.indexOf('>') === 0) {
          value = $.trim(value.replace('>', ''));
          if (value && !isNaN(value)) {
            searchString = dataTableColumn.dataSrc() + ' gt ' + value;
          }
        } else if (value.indexOf('<=') === 0) {
          value = $.trim(value.replace('<=', ''));
          if (value && !isNaN(value)) {
            searchString = dataTableColumn.dataSrc() + ' le ' + value;
          }
        } else if (value.indexOf('<') === 0) {
          value = $.trim(value.replace('<', ''));
          if (value && !isNaN(value)) {
            searchString = dataTableColumn.dataSrc() + ' lt ' + value;
          }
        } else if (value.indexOf('-') !== -1 || value.toLowerCase().indexOf('to') !== -1) {
          value = value.replace(/to/ig, '-');
          var values = value.split('-').map(function (value) {
            return $.trim(value);
          });
          if (values[0] && !isNaN(values[0])) {
            searchString = dataTableColumn.dataSrc() + ' ge ' + values[0];
            if (values[1] && !isNaN(values[1]) && +values[1] >= +values[0]) {
              searchString = searchString + ' and ' + dataTableColumn.dataSrc() + ' le ' + values[1];
            }
          }
        } else {
          if (value.indexOf('=') === 0) {
            value = $.trim(value.replace('=', ''));
          }
          if (value) {
            if (value === 'NULL') {
              searchString = dataTableColumn.dataSrc() + ' eq null';
            } else if (value === '!NULL') {
              searchString = dataTableColumn.dataSrc() + ' ne null';
            } else if (!isNaN(value)) {
              searchString = dataTableColumn.dataSrc() + ' eq ' + value;
            }
          }
        }
      }

      return searchString;
    },

    stringContains: function stringContains(value, dataTableColumn, index) {
      var searchString = '';

      if (value) {
        if (value === 'NULL') {
          searchString = dataTableColumn.dataSrc() + ' eq null';
        } else if (value === '!NULL') {
          searchString = dataTableColumn.dataSrc() + ' ne null';
        } else {
          searchString = 'contains(tolower(' + dataTableColumn.dataSrc() + '),\'' + value.toLowerCase() + '\')';
        }
      }

      return searchString;
    },

    stringEquals: function stringEquals(value, dataTableColumn, index) {
      var searchString = '';

      if (value) {
        if (value === 'NULL') {
          searchString = dataTableColumn.dataSrc() + ' eq null';
        } else if (value === '!NULL') {
          searchString = dataTableColumn.dataSrc() + ' ne null';
        } else {
          searchString = 'tolower(' + dataTableColumn.dataSrc() + ') eq \'' + value.toLowerCase() + '\'';
        }
      }

      return searchString;
    }
  }
});