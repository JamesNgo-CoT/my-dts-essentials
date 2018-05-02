"use strict";

/* exported ODataReportView */
var ODataReportView = Backbone.View.extend({

  // PROPERTY DEFINITION

  template: null,

  // METHOD DEFINITION

  render: function render() {
    this.$el.html(this.template({ model: this.model.toJSON() }));
    return Promise.resolve();
  }
});