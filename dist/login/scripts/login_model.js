'use strict';

/* global Backbone cot_app cot_login CotSession */

/* exported LoginModel */
var LoginModel = Backbone.Model.extend({

  // PROPERTY DEFINITION

  cotLogin: null,

  // METHOD DEFINITION

  checkLogin: function checkLogin() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!options.serverSide) {
      return this.cotLogin.isLoggedIn() ? Promise.resolve() : Promise.reject();
    }

    return new Promise(function (resolve, reject) {
      _this.cotLogin.session.isLoggedIn(function (result) {
        if (result === CotSession.LOGIN_CHECK_RESULT_TRUE) {
          resolve();
        } else {
          reject();
        }
      });
    });
  },

  requireLogin: function requireLogin(options) {
    var _this2 = this;

    return Promise.resolve().then(function () {
      return _this2.checkLogin(options);
    }).catch(function () {
      return _this2.showLogin(options);
    }).catch(function () {
      _this2.cotLogin.logout();
      return Promise.reject();
    });
  },
  showLogin: function showLogin() {
    var _this3 = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (this.cotLogin.modal) {
      this.cotLogin.modal.modal('hide');
    }

    return new Promise(function (resolve, reject) {
      _this3.cotLogin.modal = cot_app.showModal({
        title: 'User Login',
        body: '\n          ' + _this3.cotLogin.options.loginMessage + '\n          <form>\n            <div class="form-group">\n              <label for="cot_login_username">Username</label>:\n              <input class="form-control" id="cot_login_username">\n            </div>\n            <div class="form-group">\n              <label for="cot_login_password">Password</label>:\n              <input class="form-control" type="password" id="cot_login_password">\n            </div>\n          </form>\n        ',
        footerButtonsHtml: '\n          <button class="btn btn-success" type="button" data-dismiss="modal">Cancel</button>\n          <button class="btn btn-success btn-cot-login" type="button">Login</button>\n        ',
        originatingElement: options.$originatingElement || $(_this3.cotLogin.options['welcomeSelector']).find('a.login'),
        className: 'cot-login-modal',
        onShown: function onShown() {
          _this3.cotLogin.modal.find('.btn-cot-login').click(function () {
            _this3.cotLogin._login();
          });
          _this3.cotLogin.modal.find('.modal-body input').keydown(function (e) {
            if ((e.charCode || e.keyCode || 0) === 13) {
              _this3.cotLogin._login();
            }
          });
        },
        onHidden: function onHidden() {
          _this3.checkLogin(options).then(function () {
            resolve();
          }, function () {
            reject();
          });
        }
      });
    });
  },


  // CONSTRUCTOR DEFINITION

  initialize: function initialize(attributes, options) {
    var _this4 = this;

    this.cotLogin = new cot_login($.extend(options, {
      onLogin: function onLogin(cotLogin) {
        _this4.set(cotLogin);
      }
    }));
  }
});