"use strict";

/* global _ Backbone */

/* exported ODataModelReportView */
var ODataModelReportView = Backbone.View.extend({
  render: function render() {
    this.$el.html(this.template({ model: this.model.toJSON() }));
    return Promise.resolve();
  },

  template: _.template("\n    <div class=\"cot-report\">\n      <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">\n          <h3>Section Title</h3>\n        </div>\n\n        <div class=\"panel-body\">\n          <div class=\"row\">\n            <div class=\"col-xs-12\">\n              <dl>\n                <dt>ID</dt>\n                <dl><%= model.id %></dl>\n              </dl>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  ")
});