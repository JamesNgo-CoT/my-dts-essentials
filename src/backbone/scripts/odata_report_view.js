/* global Backbone */

/* exported ODataReportView */
/** Backbone View subclass to render an oData entity as a read only report. */
const ODataReportView = Backbone.View.extend({

  // PROPERTY DEFINITION

  /** @type {function} */
  template: null,

  // METHOD DEFINITION

  /**
   * Render method.
   * @return {Promise}
   */
  render: function() {
    this.$el.html(this.template({ model: this.model.toJSON() }));
    return Promise.resolve();
  }
});
