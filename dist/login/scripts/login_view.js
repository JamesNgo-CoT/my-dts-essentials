'use strict';

/* global _ Backbone cot_app */

/* exported LoginView */
var LoginView = Backbone.View.extend({

  // PROPERTY DEFINITION

  tagName: 'form',

  template: _.template('\n    <span class="visible-print-inline">Logged in as</span>\n    <%= model.lastName || \'\' %><%= model.lastName && model.firstName  ? \',\' : \'\' %>\n    <%= model.firstName || \'\' %>\n    <% if (model.sid == null) { %>\n    <button type="button" class="btn btn-primary btn-login">Login</button>\n    <% } else { %>\n    <button type="button" class="btn btn-default btn-logout">Logout</button>\n    <% } %>\n  '),

  // EVENT HANDLER DEFINITION

  doLogin: function doLogin() {
    this.showLogin({ $originatingElement: this.$el.find('button') }).then(function () {
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

  requireLogin: function requireLogin(options) {
    var _this = this;

    return Promise.resolve().then(function () {
      return _this.model.checkLogin(options);
    }).catch(function () {
      return _this.showLogin(options);
    }).catch(function () {
      _this.model.logout();
      return Promise.reject();
    });
  },


  render: function render() {
    this.$el.html(this.template({ model: this.model.toJSON() }));
    return Promise.resolve();
  },

  showLogin: function showLogin() {
    var _this2 = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (this.model.cotLogin.modal) {
      this.model.cotLogin.modal.modal('hide');
    }

    return new Promise(function (resolve, reject) {
      _this2.model.cotLogin.modal = cot_app.showModal({
        title: 'User Login',
        body: '\n          ' + _this2.model.cotLogin.options.loginMessage + '\n          <form>\n            <div class="form-group">\n              <label for="cot_login_username">Username</label>:\n              <input class="form-control" id="cot_login_username">\n            </div>\n            <div class="form-group">\n              <label for="cot_login_password">Password</label>:\n              <input class="form-control" type="password" id="cot_login_password">\n            </div>\n          </form>\n        ',
        footerButtonsHtml: '\n          <button class="btn btn-success" type="button" data-dismiss="modal">Cancel</button>\n          <button class="btn btn-success btn-cot-login" type="button">Login</button>\n        ',
        originatingElement: options.$originatingElement || $(_this2.model.cotLogin.options['welcomeSelector']).find('a.login'),
        className: 'cot-login-modal',
        onShown: function onShown() {
          function onLogin() {
            this.model.cotLogin._login();
          }
          _this2.model.cotLogin.modal.find('.btn-cot-login').click(function () {
            onLogin();
          });
          _this2.model.cotLogin.modal.find('.modal-body input').keydown(function (e) {
            if ((e.charCode || e.keyCode || 0) === 13) {
              onLogin();
            }
          });
        },
        onHidden: function onHidden() {
          _this2.model.checkLogin(options).then(function () {
            resolve();
          }, function () {
            reject();
          });
        }
      });
    });
  },


  // INITIALIZER DEFINITION

  initialize: function initialize() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.listenTo(this.model, 'change', this.render);
  }
});