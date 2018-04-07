/* global _ Backbone moment */

/* exported ODataDataTableView */
const ODataDataTableView = Backbone.View.extend({
  buttonCopy: function() {
    this.$el.find('.buttons-copy').click();
  },

  buttonCsv: function() {
    this.$el.find('.buttons-csv').click();
  },

  buttonExcel: function() {
    this.$el.find('.buttons-excel').click();
  },

  buttonPdf: function() {
    this.$el.find('.buttons-pdf').click();
  },

  buttonPrint: function() {
    this.$el.find('.buttons-print').click();
  },

  columns: null,

  doColumnSearch: function(e) {
    e.preventDefault();

    if (this.dataTable) {
      const $input = $(e.currentTarget);
      const value = $input.val();
      const index = +$input.closest('td').data('index');
      const dataTableColumn = this.dataTable.column(index);

      let searchString = '';

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
    'keyup tfoot :input': 'doColumnSearch',
  },

  reload: function(callback, resetPaging) {
    if (this.dataTable) {
      this.dataTable.ajax.reload(callback, resetPaging);
    }
  },

  remove: function() {
    if (this.dataTable) {
      this.dataTable.destroy();
    }

    Backbone.View.prototype.remove.call(this);
  },

  render: function(options = {}) {
    if (options.columns) {
      if (this.columns != options.columns) {
        this.columns = options.columns;
      }
    } else {
      options.columns = this.columns;
    }
    
    if (this.dataTable) {
      this.dataTable.destroy();
    }

    this.$el.html(this.template(options));

    this.dataTable = this.$el.find('table').DataTable({
      ajax: (data, callback, settings) => {
        const fetchData = {};

        // $count
        fetchData.$count = true;

        // $filter
        const $filter = data.columns.filter((value, index, array) => value.searchable && value.search && value.search.value)
          .map((value, index, array) => value.search.value)
          .join(' and ');
        if ($filter) {
          fetchData.$filter = $filter;
        }

        // $orderby
        fetchData.$orderby = data.order.map((value) => data.columns[value.column].data + ' ' + value.dir).join(',');

        // $search
        if (data.search && data.search.value) {
          fetchData.$search = '"' + data.search.value + '"';
        }

        // $select
        const $select = settings.aoColumns.map((value) => value.data)
          .map((value) => $.trim(value))
          .filter((value, index, array) => array.indexOf(value) === index)
          .join(',');
        if ($select) {
          fetchData.$select = $select;
        }

        // $skip
        fetchData.$skip = data.start;

        // $top
        fetchData.$top = data.length;

        this.trigger('loadStart');
        this.collection.fetch({ data: fetchData }).then(() => {
          this.trigger('loadEnd');
          callback({
            data: this.collection.toJSON(),
            draw: data.draw,
            recordsTotal: this.collection.count || 0,
            recordsFiltered: this.collection.count || 0
          });
        });
      },
      columns: _.result(this, 'columns'),
      dom: `<'row'<'col-sm-6'l><'col-sm-6'f>><'row'<'col-sm-12'<'table-responsive'tr>>><'row'<'col-sm-5'i><'col-sm-7'p>>B`,
      serverSide: true
    });

    return Promise.resolve();
  },

  template: _.template(`
    <table class="table table-bordered table-striped">
      <thead>
        <tr>
        <% for (var i = 0, l = view.columns.length; i < l; i++) { %>
          <th><%= view.columns[i].title || view.columns[i].data %></th>
        <% } %>
        </tr>
      </thead>
      <tfoot>
        <tr>
        <% for (var i = 0, l = view.columns.length; i < l; i++) { %>
          <td data-index="<%= i %>">
          <% if (_.result(view.columns[i], 'searchHtml')) { %>
            <%= _.result(view.columns[i], 'searchHtml') %>
          <% } %>
          </td>
        <% } %>
        </tr>
      </tfoot>
    </table>
  `)
}, {
  columnSearchMap: {
    dateEquals: (value, dataTableColumn, index) => {
      let searchString = '';
      if (value) {
        if (value === 'NULL') { searchString = dataTableColumn.dataSrc() + ' eq null'; }
        else if (value === '!NULL') { searchString = dataTableColumn.dataSrc() + ' ne null'; }
        else if (moment(value, 'l').isValid()) { searchString = dataTableColumn.dataSrc() + ' eq ' + moment(value, 'l').format(); }
      }
      return searchString;
    },

    numberEquals: (value, dataTableColumn, index) => {
      let searchString = '';
      if (value) {
        if (value === 'NULL') { searchString = dataTableColumn.dataSrc() + ' eq null'; }
        else if (value === '!NULL') { searchString = dataTableColumn.dataSrc() + ' ne null'; }
        else if (isNaN(value)) { searchString = dataTableColumn.dataSrc() + ' eq ' + value; }
      }
      return searchString;
    },

    numberExpression: (value, dataTableColumn, index) => {
      let searchString = '';
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
          if (value && !isNaN(value)) { searchString = dataTableColumn.dataSrc() + ' ge ' + value; }
        } else if (value.indexOf('>') === 0) {
          value = $.trim(value.replace('>', ''));
          if (value && !isNaN(value)) { searchString = dataTableColumn.dataSrc() + ' gt ' + value; }
        } else if (value.indexOf('<=') === 0) {
          value = $.trim(value.replace('<=', ''));
          if (value && !isNaN(value)) { searchString = dataTableColumn.dataSrc() + ' le ' + value; }
        } else if (value.indexOf('<') === 0) {
          value = $.trim(value.replace('<', ''));
          if (value && !isNaN(value)) { searchString = dataTableColumn.dataSrc() + ' lt ' + value; }
        } else if (value.indexOf('-') !== -1 || value.toLowerCase().indexOf('to') !== -1) {
          value = value.replace(/to/ig, '-');
          let values  = value.split('-').map((value) => $.trim(value));
          if (values[0] && !isNaN(values[0])) {
            searchString = dataTableColumn.dataSrc() + ' ge ' + values[0];
            if (values[1] && !isNaN(values[1]) && +values[1] >= +values[0]) {
              searchString = searchString + ' and ' + dataTableColumn.dataSrc() + ' le ' + values[1];
            }
          }
        } else {
          if (value.indexOf('=') === 0) { value = $.trim(value.replace('=', '')); }
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

    stringContains: (value, dataTableColumn, index) => {
      let searchString = '';
      if (value) {
        if (value === 'NULL') { searchString = dataTableColumn.dataSrc() + ' eq null'; }
        else if (value === '!NULL') { searchString = dataTableColumn.dataSrc() + ' ne null'; }
        else { searchString = 'contains(tolower(' + dataTableColumn.dataSrc() + '),\'' + value.toLowerCase() + '\')'; }
      }
      return searchString;
    },

    stringEquals: (value, dataTableColumn, index) => {
      let searchString = '';
      if (value) {
        if (value === 'NULL') { searchString = dataTableColumn.dataSrc() + ' eq null'; }
        else if (value === '!NULL') { searchString = dataTableColumn.dataSrc() + ' ne null'; }
        else { searchString = 'tolower(' + dataTableColumn.dataSrc() + ') eq \'' + value.toLowerCase() + '\''; }
      }
      return searchString;
    }
  }
});
