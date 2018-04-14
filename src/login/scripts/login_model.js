/* global Backbone cot_login CotSession */

/* exported LoginModel */
const LoginModel = Backbone.Model.extend({

  // PROPERTY DEFINITION

  cotLogin: null,

  // METHOD DEFINITION

  checkLogin: function(options = {}) {
    if (!options.serverSide) {
      return this.cotLogin.isLoggedIn() ? Promise.resolve() : Promise.reject();
    }

    return new Promise((resolve, reject) => {
      this.cotLogin.session.isLoggedIn((result) => {
        if (result === CotSession.LOGIN_CHECK_RESULT_TRUE) {
          resolve();
        } else {
          reject();
        }
      });
    });
  },

  login: function(username, password) {
    return new Promise((resolve, reject) => {
      this.cotLogin.session.login({
        error: (jqXHR, textStatus, error) => {
          reject(error);
        },
        username: username,
        password: password,
        success: () => {
          this.cotLogin._setUserName();
          resolve();
        }
      });
    })
  },

  logout: function() {
    this.cotLogin.logout();
  },

  // CONSTRUCTOR DEFINITION

  initialize: function(attributes, options) {
    this.cotLogin = new cot_login($.extend(options, {
      onLogin: (cotLogin) => {
        this.set(cotLogin);
      }
    }));
  }
});
