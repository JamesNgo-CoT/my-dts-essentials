'use strict';

/* global _ Backbone */

/* exported LoginView */
var LoginView = Backbone.View.extend({

  // PROPERTY DEFINITION

  tagName: 'form',

  template: _.template('\n    <span class="visible-print-inline">Logged in as</span>\n    <%= model.lastName || \'\' %><%= model.lastName && model.firstName  ? \',\' : \'\' %>\n    <%= model.firstName || \'\' %>\n    <% if (model.sid == null) { %>\n    <button type="button" class="btn btn-primary btn-login">Login</button>\n    <% } else { %>\n    <button type="button" class="btn btn-default btn-logout">Logout</button>\n    <% } %>\n  '),

  // EVENT HANDLER DEFINITION

  doLogin: function doLogin() {
    this.model.showLogin({ $originatingElement: this.$el.find('button') }).then(function () {
      Backbone.history.stop();
      Backbone.history.start();
    });
  },

  doLogout: function doLogout() {
    this.model.cotLogin.logout();
  },

  events: {
    'click .btn-login': 'doLogin',
    'click .btn-logout': 'doLogout'
  },

  // METHOD DEFINITION

  render: function render() {
    this.$el.html(this.template({ model: this.model.toJSON() }));
    return Promise.resolve();
  },

  // INITIALIZER DEFINITION

  initialize: function initialize() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.listenTo(this.model, 'change', this.render);
  }
});