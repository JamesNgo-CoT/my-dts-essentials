"use strict";

/* global Backbone */

/* exported ODataReportView */
/** Backbone View subclass to render an oData entity as a read only report. */
var ODataReportView = Backbone.View.extend({

  // PROPERTY DEFINITION

  template: null,

  // METHOD DEFINITION

  render: function render() {
    this.$el.html(this.template({ model: this.model.toJSON() }));
    return Promise.resolve();
  }
});