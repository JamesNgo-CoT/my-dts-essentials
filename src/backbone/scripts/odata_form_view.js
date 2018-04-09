/* global _ Backbone CotForm */

/* exported ODataFormView */
const ODataFormView = Backbone.View.extend({

  // PROPERTY DEFINITION

  sections: null,

  rootPath: null,

  template: _.template(`
    <div class="hidden-print">
      <a href="#" class="btn btn-default btn-cancel">Cancel</a>
      <button type="button" class="btn btn-default btn-save">Save</button>
    </div>

    <div class="cot-form"></div>

    <div class="hidden-print">
      <a href="#" class="btn btn-default btn-cancel">Cancel</a>
      <button type="button" class="btn btn-default btn-save">Save</button>
    </div>
  `),

  // EVENT HANDLER DEFINITION

  doCancel: function(e) {

    if (!confirm('Any changes made will not be saved. Do you want to continue?')) {
      e.preventDefault();
      return false;
    }
  },

  doSave: function(e) {
    e.preventDefault();
    this.$el.find('form').submit();
  },

  events: {
    'click .btn-cancel': 'doCancel',
    'click .btn-save': 'doSave'
  },

  // METHOD DEFINITION

  render: function(options = {}) {
    this.$el.html(this.template({ model: this.model.toJSON() }));

    const form = new CotForm({
      id: 'form_' + this.model.cid,
      rootPath: _.result(this, 'rootPath'),
      success: (e) => {
        e.preventDefault();
        this.model.save().then(options.success || (() => alert('Saved!')));
        return false;
      },
      useBinding: true,
      sections: _.result(this, 'sections')
    });

    form.setModel(this.model);
    form.render({
      target: this.$el.find('.cot-form')
    });

    return Promise.resolve();
  }
});
