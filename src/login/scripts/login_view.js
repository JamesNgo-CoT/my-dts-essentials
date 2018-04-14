/* global _ Backbone cot_app */

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
    this.showLogin({ $originatingElement: this.$el.find('button') }).then(() => {
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

  requireLogin(options) {
    return Promise.resolve().then(() => {
      return this.model.checkLogin(options);
    }).catch(() => {
      return this.showLogin(options);
    }).catch(() => {
      this.model.logout();
      return Promise.reject();
    });
  },

  render: function() {
    this.$el.html(this.template({ model: this.model.toJSON() }));
    return Promise.resolve();
  },

  showLogin(options = {}) {
    if (this.model.cotLogin.modal) {
      this.model.cotLogin.modal.modal('hide');
    }

    return new Promise((resolve, reject) => {
      this.model.cotLogin.modal = cot_app.showModal({
        title: 'User Login',
        body: `
          ${this.model.cotLogin.options.loginMessage}
          <form>
            <div class="form-group">
              <label for="cot_login_username">Username</label>:
              <input class="form-control" id="cot_login_username">
            </div>
            <div class="form-group">
              <label for="cot_login_password">Password</label>:
              <input class="form-control" type="password" id="cot_login_password">
            </div>
          </form>
        `,
        footerButtonsHtml: `
          <button class="btn btn-success" type="button" data-dismiss="modal">Cancel</button>
          <button class="btn btn-success btn-cot-login" type="button">Login</button>
        `,
        originatingElement: options.$originatingElement || $(this.model.cotLogin.options['welcomeSelector']).find('a.login'),
        className: 'cot-login-modal',
        onShown: () => {
          function onLogin() {
            this.model.cotLogin._login();
          }
          this.model.cotLogin.modal.find('.btn-cot-login').click(() => {
            onLogin();
          });
          this.model.cotLogin.modal.find('.modal-body input').keydown((e) => {
            if ((e.charCode || e.keyCode || 0) === 13) {
              onLogin();
            }
          });
        },
        onHidden: () => {
          this.model.checkLogin(options).then(() => {
            resolve();
          }, () => {
            reject();
          });
        }
      });
    });
  },

  // INITIALIZER DEFINITION

  initialize: function(options = {}) {
    this.listenTo(this.model, 'change', this.render);
  },
});
