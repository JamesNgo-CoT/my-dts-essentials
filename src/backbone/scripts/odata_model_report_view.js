/* global _ Backbone */

/* exported ODataModelReportView */
const ODataModelReportView = Backbone.View.extend({
  render: function() {
    this.$el.html(this.template({ model: this.model.toJSON() }));
    return Promise.resolve();
  },

  template: _.template(`
    <div class="cot-report">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3>Section Title</h3>
        </div>

        <div class="panel-body">
          <div class="row">
            <div class="col-xs-12">
              <dl>
                <dt>ID</dt>
                <dl><%= model.id %></dl>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  `)
});
