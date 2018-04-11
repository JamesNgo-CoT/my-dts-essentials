'use strict';

/* global _ ODataDataTableView */

/* exported ODataDataTablePageView */
var ODataDataTablePageView = ODataDataTableView.extend({

  // PROPERTY DEFINITION

  columns: null,

  template: _.template('\n    <div>\n      <button type="button" class="btn btn-default btn-reload">Reload Data</button>\n      <div class="btn-group pull-right">\n        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n          Actions <span class="caret"></span>\n        </button>\n        <ul class="dropdown-menu">\n          <li><a href="#" class="button-copy">Copy</a></li>\n          <li><a href="#" class="button-csv">CSV</a></li>\n          <li><a href="#" class="button-excel">Excel</a></li>\n          <li><a href="#" class="button-pdf">PDF</a></li>\n          <li><a href="#" class="button-print">Print</a></li>\n        </ul>\n      </div>\n    </div>\n\n    <%= datatable %>\n\n    <div>\n      <button type="button" class="btn btn-default btn-reload">Reload Data</button>\n      <div class="btn-group pull-right">\n        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n          Actions <span class="caret"></span>\n        </button>\n        <ul class="dropdown-menu">\n          <li><a href="#" class="button-copy">Copy</a></li>\n          <li><a href="#" class="button-csv">CSV</a></li>\n          <li><a href="#" class="button-excel">Excel</a></li>\n          <li><a href="#" class="button-pdf">PDF</a></li>\n          <li><a href="#" class="button-print">Print</a></li>\n        </ul>\n      </div>\n    </div>\n  '),

  // EVENT HANDLER DEFINITION

  doButtonCopy: function doButtonCopy(e) {
    e.preventDefault();
    this.buttonCopy();
  },

  doButtonCsv: function doButtonCsv(e) {
    e.preventDefault();
    this.buttonCsv();
  },

  doButtonExcel: function doButtonExcel(e) {
    e.preventDefault();
    this.buttonExcel();
  },

  doButtonPdf: function doButtonPdf(e) {
    e.preventDefault();
    this.buttonPdf();
  },

  doButtonPrint: function doButtonPrint(e) {
    e.preventDefault();
    this.buttonPrint();
  },

  doReload: function doReload(e) {
    e.preventDefault();
    this.reload(null, true);
  },

  events: $.extend({}, ODataDataTableView.prototype.events, {
    'click .btn-reload': 'doReload',

    'click .button-copy': 'doButtonCopy',
    'click .button-csv': 'doButtonCsv',
    'click .button-excel': 'doButtonExcel',
    'click .button-pdf': 'doButtonPDF',
    'click .button-print': 'doButtonPrint'
  }),

  // METHOD DEFINITION

  render: function render() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    console.log('ODATA DATATABLE PAGE VIEW RENDER');

    if (options.columns) {
      this.columns = _.result(options, 'columns');
    } else {
      options.columns = _.result(this, 'columns');
    }
    options.datatable = ODataDataTableView.prototype.template.call(this, options);

    return ODataDataTableView.prototype.render.call(this, options);
  }
});