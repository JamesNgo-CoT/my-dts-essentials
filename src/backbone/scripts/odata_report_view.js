
/* exported ODataReportView */
const ODataReportView = Backbone.View.extend({

  // PROPERTY DEFINITION

  template: null,

  // METHOD DEFINITION

  render: function() {
    this.$el.html(this.template({ model: this.model.toJSON() }));
    return Promise.resolve();
  }
});
