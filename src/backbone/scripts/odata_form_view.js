/* global _ Backbone CotForm */

/* exported ODataFormView */
const ODataFormView = Backbone.View.extend({
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

  sections: [{
    rows: [{
      fields: [{
        bindto: 'id',
        id: 'id',
        required: true,
        title: 'ID',
        type: 'text'
      }]
    }]
  }],

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
  },

  rootPath: '/* @echo SRC_PATH *//',

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
  `)
});
