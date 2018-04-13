/* global _ Backbone */

/* exported LoginView */
const LoginView = Backbone.View.extend({

  // PROPERTY DEFINITION

  tagName: 'form',

  template: _.template(`
    <span class="visible-print-inline">Logged in as</span>
    <%= model.lastName || '' %><%= model.lastName && model.firstName  ? ',' : '' %>
    <%= model.firstName || '' %>
    <% if (model.sid == null) { %>
    <button type="button" class="btn btn-primary btn-login">Login</button>
    <% } else { %>
    <button type="button" class="btn btn-default btn-logout">Logout</button>
    <% } %>
  `),

  // EVENT HANDLER DEFINITION

  doLogin: function() {
    this.model.showLogin({ $originatingElement: this.$el.find('button') }).then(() => {
      Backbone.history.stop();
      Backbone.history.start()
    });
  },

  doLogout: function() {
    this.model.cotLogin.logout();
  },

  events: {
    'click .btn-login': 'doLogin',
    'click .btn-logout': 'doLogout'
  },

  // METHOD DEFINITION

  render: function() {
    this.$el.html(this.template({ model: this.model.toJSON() }));
    return Promise.resolve();
  },

  // INITIALIZER DEFINITION

  initialize: function(options = {}) {
    this.listenTo(this.model, 'change', this.render);
  },
});
