/* global _ Backbone */

/* exported LoginView */
const LoginView = Backbone.View.extend({
  cotLogin: null,

  doLogin: function() {
    _.result(this, 'cotLogin').showLogin({ $originatingElement: this.$el.find('button') }).then(() => {
      Backbone.history.stop();
      Backbone.history.start()
    });
  },

  doLogout: function() {
    _.result(this, 'cotLogin').logout();
  },

  events: {
    'click .btn-login': 'doLogin',
    'click .btn-logout': 'doLogout'
  },

  initialize: function(options = {}) {
    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {
    this.$el.html(this.template({ model: this.model }));
    return Promise.resolve();
  },

  tagName: 'form',

  template: _.template(`
    <span class="visible-print-inline">Logged in as</span>
    <%= model.lastName ? model.lastName : '' %><%= model.lastName && model.firstName  ? ',' : '' %>
    <%= model.firstName ? model.firstName : '' %>
    <% if (model.sid) { %>
    <button type="button" class="btn btn-primary btn-logout">Logout</button>
    <% } else { %>
    <button type="button" class="btn btn-default btn-login">Login</button>
    <% } %>
  `)
});
