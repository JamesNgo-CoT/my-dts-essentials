/* global _ ODataDataTableView */

/* exported ODataDataTablePageView */
const ODataDataTablePageView = ODataDataTableView.extend({
  doButtonCopy: function(e) {
    e.preventDefault();
    this.buttonCopy();
  },

  doButtonCsv: function(e) {
    e.preventDefault();
    this.buttonCsv();
  },

  doButtonExcel: function(e) {
    e.preventDefault();
    this.buttonExcel();
  },

  doButtonPdf: function(e) {
    e.preventDefault();
    this.buttonPdf();
  },

  doButtonPrint: function(e) {
    e.preventDefault();
    this.buttonPrint();
  },

  doReload: function(e) {
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

  render: function(options = {}) {
    if (options.columns) {
      if (this.columns != options.columns) {
        this.columns = options.columns;
      }
    } else {
      options.columns = this.columns;
    }

    options.datatable = ODataDataTableView.prototype.template.call(this, options);

    return ODataDataTableView.prototype.render.call(this, options);
  },

  template: _.template(`
    <div>
      <button type="button" class="btn btn-default btn-reload">Reload Data</button>
      <div class="btn-group pull-right">
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Actions <span class="caret"></span>
        </button>
        <ul class="dropdown-menu">
          <li><a href="#" class="button-copy">Copy</a></li>
          <li><a href="#" class="button-csv">CSV</a></li>
          <li><a href="#" class="button-excel">Excel</a></li>
          <li><a href="#" class="button-pdf">PDF</a></li>
          <li><a href="#" class="button-print">Print</a></li>
        </ul>
      </div>
    </div>

    <%= datatable %>

    <div>
      <button type="button" class="btn btn-default btn-reload">Reload Data</button>
      <div class="btn-group pull-right">
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Actions <span class="caret"></span>
        </button>
        <ul class="dropdown-menu">
          <li><a href="#" class="button-copy">Copy</a></li>
          <li><a href="#" class="button-csv">CSV</a></li>
          <li><a href="#" class="button-excel">Excel</a></li>
          <li><a href="#" class="button-pdf">PDF</a></li>
          <li><a href="#" class="button-print">Print</a></li>
        </ul>
      </div>
    </div>
  `)
});
