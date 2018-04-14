"use strict";

/* global Backbone cot_login CotSession */

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

  login: function login(username, password) {
    var _this2 = this;

    return new Promise(function (resolve, reject) {
      _this2.cotLogin.session.login({
        error: function error(jqXHR, textStatus, _error) {
          reject(_error);
        },
        username: username,
        password: password,
        success: function success() {
          _this2.cotLogin._setUserName();
          resolve();
        }
      });
    });
  },

  logout: function logout() {
    this.cotLogin.logout();
  },

  // CONSTRUCTOR DEFINITION

  initialize: function initialize(attributes, options) {
    var _this3 = this;

    this.cotLogin = new cot_login($.extend(options, {
      onLogin: function onLogin(cotLogin) {
        _this3.set(cotLogin);
      }
    }));
  }
});