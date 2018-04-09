'use strict';

/* global _ Backbone CotForm */

/* exported ODataFormView */
/** Backbone View subclass to render an oData entity as an interactive form. */
var ODataFormView = Backbone.View.extend({

  // PROPERTY DEFINITION

  /** @type {Object[]} */
  sections: null,

  /** @type {string|function} */
  rootPath: null,

  /** @type {function} */
  template: _.template('\n    <div class="hidden-print">\n      <a href="#" class="btn btn-default btn-cancel">Cancel</a>\n      <button type="button" class="btn btn-default btn-save">Save</button>\n    </div>\n\n    <div class="cot-form"></div>\n\n    <div class="hidden-print">\n      <a href="#" class="btn btn-default btn-cancel">Cancel</a>\n      <button type="button" class="btn btn-default btn-save">Save</button>\n    </div>\n  '),

  // EVENT HANDLER DEFINITION

  /**
   * Handles "click on cancel button" event.
   * @param  {Event} e
   * @return {[boolean]} Returns false to prevent default behaviour.
   */
  doCancel: function doCancel(e) {

    if (!confirm('Any changes made will not be saved. Do you want to continue?')) {
      e.preventDefault();
      return false;
    }
  },

  /**
   * Handles "click on save button" event.
   * @param  {Event} e
   */
  doSave: function doSave(e) {
    e.preventDefault();
    this.$el.find('form').submit();
  },

  /** Events */
  events: {
    'click .btn-cancel': 'doCancel',
    'click .btn-save': 'doSave'
  },

  // METHOD DEFINITION

  /**
   * Render method.
   * @param  {[Object]} options
   * @return {Promise}
   */
  render: function render() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.$el.html(this.template({ model: this.model.toJSON() }));

    var form = new CotForm({
      id: 'form_' + this.model.cid,
      rootPath: _.result(this, 'rootPath'),
      success: function success(e) {
        e.preventDefault();
        _this.model.save().then(options.success || function () {
          return alert('Saved!');
        });
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