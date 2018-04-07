'use strict';

/* global _ ODataCollectionDataTableView */

/* exported ODataCollectionDataTablePageView */
var ODataCollectionDataTablePageView = ODataCollectionDataTableView.extend({
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

  events: $.extend({}, ODataCollectionDataTableView.prototype.events, {
    'click .btn-reload': 'doReload',

    'click .button-copy': 'doButtonCopy',
    'click .button-csv': 'doButtonCsv',
    'click .button-excel': 'doButtonExcel',
    'click .button-pdf': 'doButtonPDF',
    'click .button-print': 'doButtonPrint'
  }),

  render: function render() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    options.datatable = ODataCollectionDataTableView.prototype.template.call(this, options);
    return ODataCollectionDataTableView.prototype.render.call(this, options);
  },

  template: _.template('\n    <div>\n      <button type="button" class="btn btn-default btn-reload">Reload Data</button>\n      <div class="btn-group pull-right">\n        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n          Actions <span class="caret"></span>\n        </button>\n        <ul class="dropdown-menu">\n          <li><a href="#" class="button-copy">Copy</a></li>\n          <li><a href="#" class="button-csv">CSV</a></li>\n          <li><a href="#" class="button-excel">Excel</a></li>\n          <li><a href="#" class="button-pdf">PDF</a></li>\n          <li><a href="#" class="button-print">Print</a></li>\n        </ul>\n      </div>\n    </div>\n\n    <%= datatable %>\n\n    <div>\n      <button type="button" class="btn btn-default btn-reload">Reload Data</button>\n      <div class="btn-group pull-right">\n        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n          Actions <span class="caret"></span>\n        </button>\n        <ul class="dropdown-menu">\n          <li><a href="#" class="button-copy">Copy</a></li>\n          <li><a href="#" class="button-csv">CSV</a></li>\n          <li><a href="#" class="button-excel">Excel</a></li>\n          <li><a href="#" class="button-pdf">PDF</a></li>\n          <li><a href="#" class="button-print">Print</a></li>\n        </ul>\n      </div>\n    </div>\n  ')
});